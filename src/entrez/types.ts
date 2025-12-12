export interface IEntrezDbInfo {
  name: string;
  printName: string;
  descirption: string;
  build: string;
  count: number;
  lastUpdate: Date;
  /**
   * Fields exploitable while using ESearch utility
   */
  fields: {
    name: string;
    fullName: string;
    description: string;
    count: number;
    isDate: boolean;
    isNumerical: boolean;
    singleToken: boolean;
    hierarchy: boolean;
    isHidden: boolean;
  }[];
  links: {
    name: string;
    printName: string;
    description: string;
    db: string;
  }[];
}

/**
 * https://www.ncbi.nlm.nih.gov/books/NBK25499/#chapter4.ESearch
 */
export interface IEntrezSearchParams {
  db: string; // stronger typings
  /**
   * Entrez text query. All special characters must be URL encoded. Spaces may be replaced by '+' signs. For very long queries (more than several hundred characters long), consider using an HTTP POST call. See the PubMed or Entrez help for information about search field descriptions and tags. Search fields and tags are database specific.
   *
   * `esearch.fcgi?db=pubmed&term=asthma`
   *
   * PubMed also offers “proximity searching” for multiple terms appearing in any order within a specified number of words from one another in the [Title] or [Title/Abstract] fields.
   *
   * `esearch.fcgi?db=pubmed&term=”asthma treatment”[Title:~3]`
   */
  term: string;
  usehistory?: "y" | "n";
  WebEnv?: string;
  query_key?: number;
  retstart?: number;
  retmax?: number;
  rettype?: "uilist" | "count";
  sort?: string; // to be clarified, allowed values change based on the db
  field?: string;
  idtype?: "acc";
  datetype?: "mdat" | "pdat" | "edat"; // to be clarified, allowed values change based on the db
  reldate?: number;
  mindate?: string;
  maxdate?: string;
}
