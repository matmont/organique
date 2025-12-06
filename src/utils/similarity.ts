import { writeFile as nodeWriteFile } from "fs/promises";

interface IDotPlotOptions {
  writeFile: boolean;
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
