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

export interface INCBIResults {}
