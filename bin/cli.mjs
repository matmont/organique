import { dna, protein, rna } from "../dist/index.mjs";
import { Command } from "commander";
import { readFile } from "node:fs/promises";

const rawPkgJson = await readFile(
  new URL("../package.json", import.meta.url),
  "utf8"
);
const pkgJson = JSON.parse(rawPkgJson);
const { name, version, description } = pkgJson;
const program = new Command();
program.name(name).description(description).version(version);

program
  .command("dna-stats")
  .description("Compute an overview stats of the provided DNA strand")
  .argument("<strand>", "strand of DNA as a string (sequence of base's chars)")
  .argument(
    "[strand-type]",
    "nature of the provided strand [coding | template]",
    "coding"
  )
  .action((strand, direction) => {
    dna.assertValidDna(strand);
    if (
      direction != null &&
      direction !== "coding" &&
      direction !== "template"
    ) {
      console.error(
        "Wrong argument provided for [strand-type]. Check help with -h"
      );
      return;
    }
    console.info(`📏​ Chain length: ${strand.length}`);
    console.info(
      `📜​ Transcription: ${rna.transcribeFromDna(strand, direction)}`
    );
    console.info(
      `♾️​ Reverse Complement: ${dna.computeReverseComplement(strand)}`
    );
    console.info(`💯​ GC Content: ${dna.computeGCContent(strand)}`);
    console.info(
      `⛓️​ Translation (offset set to 0): ${protein.translateDnaSequence(
        strand
      )}`
    );
    const proteins = protein.retrieveProteinsFromAllDnaReadingFrames(strand);
    console.info(`💊​ Potential Proteins: ${proteins?.length ?? 0}`);
    proteins.forEach((p, i) => {
      console.log(`   ​​📌​ Protein ${i + 1}: ${p} (length: ${p.length - 1})`);
    });
  });

program.parse();
