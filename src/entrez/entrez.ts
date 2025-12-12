import type { IEntrezDbInfo, IEntrezSearchParams } from "./types";

const ENTREZ_BASE_URL = `https://eutils.ncbi.nlm.nih.gov/entrez/`;

export async function einfo(db?: string): Promise<string[] | IEntrezDbInfo> {
  const url = `${ENTREZ_BASE_URL}/eutils/einfo.fcgi?retmode=JSON${
    db ? `&db=${db}` : ""
  }`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(
      `Something went wrong while fetching ENTREZ: ${res.statusText} (${res.status})`
    );
  }

  const json = await res.json();

  if (db == null) {
    return json.einforesult.dblist as string[];
  }

  const dbinfo = json.einforesult.dbinfo[0];

  return {
    build: dbinfo.dbbuild,
    count: +dbinfo.count,
    lastUpdate: new Date(dbinfo.lastupdate),
    descirption: dbinfo.description,
    fields: dbinfo.fieldlist.map((rawField: any) => {
      return {
        count: rawField.termcount,
        description: rawField.description,
        fullName: rawField.fullname,
        hierarchy: rawField.hierarchy === "Y" ? true : false,
        isDate: rawField.isdate === "Y" ? true : false,
        isNumerical: rawField.isnumerical === "Y" ? true : false,
        isHidden: rawField.ishidden === "Y" ? true : false,
        singleToken: rawField.singletoken === "Y" ? true : false,
        name: rawField.name,
      } as IEntrezDbInfo["fields"][0];
    }),
    links: dbinfo.linklist.map((rawLink: any) => {
      return {
        db: rawLink.dbto,
        description: rawLink.description,
        name: rawLink.name,
        printName: rawLink.menu,
      } as IEntrezDbInfo["links"][0];
    }),
    name: dbinfo.dbname,
    printName: dbinfo.menuname,
  } as IEntrezDbInfo;
}

export async function esearch(params: IEntrezSearchParams) {
  const stringParams = Object.entries(params).map(
    ([k, v]) => [k, String(v)] as [string, string]
  );
  const urlSearchParams = new URLSearchParams(stringParams);

  /**
   * Apparently the REST server does not support correctly encoded params, reverting the work of URLSearchParams
   * for a couple of known symbols
   */
  let urlSearchParamsSanit = urlSearchParams
    .toString()
    .replace("%3A", ":")
    .replace("%5B", "[")
    .replace("%2B", "+")
    .replace("%5D", "]");

  const url = `${ENTREZ_BASE_URL}/eutils/esearch.fcgi?retmode=JSON&${urlSearchParamsSanit}`;
  console.log(url);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(
      `Something went wrong while fetching ENTREZ: ${res.statusText} (${res.status})`
    );
  }

  const json = await res.json();
  return json;
}
