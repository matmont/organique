import { writeFile as nodeWriteFile, readFile } from "fs/promises";
import path from "node:path";
import { getCurrentDir } from "./file";

interface IDotPlotOptions {
  writeFile: boolean;
}

export interface ISubstitutionMatrix {
  legend: string[];
  matrix: number[][];
  name: string;
  type: "score" | "penalty";
}

/**
 * Compute dot-plot between two sequences.
 * @param seqA the sequence that will be put on the rows
 * @param seqB the sequence that will be put on the columns
 * @param opts couple of options to customize function behavior (e.g. writeFile to create a .pbm image of the plot)
 */
export async function generateDotPlot(
  seqA: string,
  seqB: string,
  opts?: IDotPlotOptions
) {
  const { writeFile = false } = opts ?? {};
  const mat = [];
  const filename = `dotplot_${Date.now()}.pbm`;
  if (writeFile) {
    await nodeWriteFile(filename, `P1\n${seqA.length} ${seqB.length}\n`);
  }

  for (const charA of seqA) {
    const row = [];
    for (const charB of seqB) {
      row.push(charA === charB ? 1 : 0);
    }
    mat.push(row);
    if (writeFile) {
      await nodeWriteFile(filename, `${row.join(" ")}\n`, { flag: "a" });
    }
  }

  return mat;
}

/**
 * Read the requested substitution matrix from a file provided into the library.
 *
 * @param matrixName BLOSUM50 or BLOSUM65
 * @returns the substitution matrix with its own legend to help indexing it correctly
 */
export async function readSubstitutionMatrix(
  matrixName: "BLOSUM50" | "BLOSUM65"
): Promise<ISubstitutionMatrix> {
  let legend: string[] = [];
  let matrix: number[][] = [];
  const matrixPath = path.join(
    getCurrentDir(),
    "assets",
    `${matrixName.toLowerCase()}.txt`
  );
  let data = await readFile(matrixPath, { encoding: "utf8" });
  const rows = data.replaceAll("\r", "").split("\n");
  rows.forEach((row, idx) => {
    const rowCells = row.trim().split(/\s+/);
    if (idx === 0) {
      legend = rowCells;
      return;
    }

    matrix.push(rowCells.slice(1).map((v) => +v));
  });

  return {
    name: matrixName,
    legend,
    matrix,
    type: "score", // Other submatrices could have penalty instead
  };
}
