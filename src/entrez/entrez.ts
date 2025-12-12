import { XMLParser } from "fast-xml-parser";
import type { IEntrezDbInfo } from "./types";

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
  const parser = new XMLParser({
    ignoreAttributes: true,
  });
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
