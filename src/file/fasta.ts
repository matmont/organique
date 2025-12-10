import path from "node:path";
import { getCurrentDir } from "../utils/file";
import { readFile } from "node:fs/promises";

export async function readFastaFile(filepath: string): Promise<{
  name: string;
  sequence: string;
}> {
  const _path = path.join(getCurrentDir(), filepath);
  const data = await readFile(_path, { encoding: "utf8" });
  const rows = data.split("\n");

  return {
    name: rows[0].replace(">", ""),
    sequence: rows.slice(1).join(""),
  };
}
