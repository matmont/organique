/**
 * https://blast.ncbi.nlm.nih.gov/doc/blast-help/urlapi.html#urlapi
 */
export interface INCBISearchOptions {
  QUERY: string; // Accession, GI, or FASTA
  DATABASE: string; // Database file name (e.g.: core_nt, swissprot)
  PROGRAM:
    | "blastn"
    | "blastn&amp;MEGABLAST=on"
    | "blastp"
    | "blastx"
    | "tblastn"
    | "tblastx";
  EXPECT?: number;
  FORMAT_TYPE?:
    | "HTML"
    | "Text"
    | "XML2"
    | "XML2_S"
    | "JSONSA"
    | "JSON2"
    | "JSON2_S"
    | "SAM"
    | "Text&amp;ALIGNMENT_VIEW=Tabular";
  email?: string;
}

/**
 * https://blast.ncbi.nlm.nih.gov/doc/blast-help/urlapi.html#urlapi
 */
export interface INCBIResultOptions {
  RID: string;
  FORMAT_TYPE?:
    | "HTML"
    | "Text"
    | "XML2"
    | "XML2_S"
    | "JSONSA"
    | "JSON2"
    | "JSON2_S"
    | "SAM"
    | "Text&amp;ALIGNMENT_VIEW=Tabular";
  DESCRIPTIONS?: number;
  ALIGNMENTS?: number;
  NCBI_GI?: boolean;
}

export interface INCBIResults {
  program: INCBISearchOptions["PROGRAM"];
  version: string;
  targetDatabase: string;
  parameters: {
    substitutionMatrix: string;
    expectValue: number;
    /**
     * TODO:
     * gap-open
     * gap-extend
     * filter
     * cbs
     */
    gapOpenCost: number;
    gapExtendCost: number;
  };
  // Each <Search> tag represents a BlastRecord object
  // and it maps to a single precise QUERY
  records: {
    query: {
      id: string;
      title: string;
      sequenceLength: number;
    };
    hits: {
      target: {
        id: string;
        accession: string;
        title: string;
        taxId: number;
        scientificName: string;
        length: number;
      };
      alignments: {
        score: number;
        normalizedScore: number;
        evalue: number;
        querySubsequence: string;
        targetSubsequence: string;
        formattedAlignment: string;
        queryRegion: {
          from: number;
          to: number;
        };
        targetRegion: {
          from: number;
          to: number;
        };
        gaps: number;
        identityPercentage: number;
      }[];
    }[];
  }[];
}
