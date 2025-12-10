import { XMLParser } from "fast-xml-parser";
import type {
  INCBISearchOptions,
  INCBIResultOptions,
  INCBIResults,
} from "./types";

export async function scheduleRemoteSearch(options: INCBISearchOptions) {
  const URL = `https://blast.ncbi.nlm.nih.gov/Blast.cgi`;
  const entries = Object.entries(options).map(
    ([k, v]) => [k, String(v)] as [string, string]
  );

  const payload = `CMD=Put&${new URLSearchParams(entries).toString()}`;

  const res = await fetch(URL, {
    body: payload,
    method: "POST",
    headers: {
      "User-Agent": "OrganiqueClient",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    keepalive: true,
  });

  const text = await res.text();

  const ridMatch = text.match(/RID = (\S+)/);
  const rtoeMatch = text.match(/RTOE = (\d+)/);
  const rid = ridMatch?.[1];
  const rtoe = rtoeMatch?.[1];

  if (!rid || !rtoe) {
    console.error("Something went wrong during request");
    return null;
  }

  return {
    requestIdentifier: rid,
    requestTimeOfExecution: +rtoe,
  };
}

export async function pollRemoteResult(options: INCBIResultOptions) {
  const URL = `https://blast.ncbi.nlm.nih.gov/Blast.cgi`;
  const entries = Object.entries(options).map(
    ([k, v]) => [k, String(v)] as [string, string]
  );

  const payload = `CMD=Get&${new URLSearchParams(entries).toString()}`;

  const res = await fetch(URL, {
    body: payload,
    method: "POST",
    headers: {
      "User-Agent": "OrganiqueClient",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    keepalive: true,
  });

  return await res.text();
}

/**
 * TODO: Refactor asap, unreadable :(
 * @param rid
 * @returns
 */
export async function formatBlastResult(rid: string): Promise<INCBIResults> {
  const res = await pollRemoteResult({
    RID: rid,
    FORMAT_TYPE: "XML2_S",
  });
  const parser = new XMLParser({
    ignoreAttributes: true,
  });
  const jsonObj = parser.parse(res);
  const report = jsonObj.BlastXML2.BlastOutput2.report.Report;
  const results = report.results.Results;
  const hasMultipleQueries = Array.isArray(results.search);
  const searches = hasMultipleQueries ? results.search : [results.search];
  const records: INCBIResults["records"] = searches.map((res: any) => {
    const rawSearch = res.Search;
    const hasMultipleHits = Array.isArray(rawSearch.hits.Hit);
    const rawHits = hasMultipleHits ? rawSearch.hits.Hit : [rawSearch.hits.Hit];

    return {
      hits: rawHits.map((rawHit: any) => {
        const hasMultipleAligns = Array.isArray(rawHit.hsps);
        const rawAlignments = hasMultipleAligns ? rawHit.hsps : [rawHit.hsps];
        return {
          alignments: rawAlignments.map((align: any) => {
            const rawAlign = align.Hsp;
            return {
              evalue: rawAlign.evalue,
              formattedAlignment: rawAlign.midline,
              gaps: rawAlign.gaps,
              identityPercentage: rawAlign.identity / rawAlign["align-len"],
              normalizedScore: rawAlign["bit-score"],
              queryRegion: {
                from: rawAlign["query-from"],
                to: rawAlign["query-to"],
              },
              querySubsequence: rawAlign.qseq,
              targetSubsequence: rawAlign.hseq,
              score: rawAlign.score,
              targetRegion: {
                from: rawAlign["hit-from"],
                to: rawAlign["hit-to"],
              },
            } as INCBIResults["records"][0]["hits"][0]["alignments"][0];
          }),
          target: {
            accession: rawHit.description.HitDescr.accession,
            id: rawHit.description.HitDescr.id,
            length: rawHit.len,
            scientificName: rawHit.description.HitDescr.sciname,
            taxId: rawHit.description.HitDescr.taxid,
            title: rawHit.description.HitDescr.title,
          },
        } as INCBIResults["records"][0]["hits"][0];
      }),
      query: {
        id: rawSearch["query-id"],
        sequenceLength: rawSearch["query-len"],
        title: rawSearch["query-title"],
      },
    } as INCBIResults["records"][0];
  });

  return {
    program: report.program,
    version: report.version,
    targetDatabase: report["search-target"].Target.db,
    parameters: {
      expectValue: report.params.Parameters.expect,
      gapExtendCost: report.params.Parameters["gap-extend"],
      gapOpenCost: report.params.Parameters["gap-open"],
      substitutionMatrix: report.params.Parameters.matrix,
    },
    records,
  };
}
