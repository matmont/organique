import { computeReadingFrames } from "../dna/processing";
import { assertValidDna } from "../dna/validation";
import { sanitizeString } from "../utils/string";
import { Aminoacids } from "./ammino";
import { GeneticCode, HUMAN_GENETIC_CODE, StopCodon } from "./geneticCode";

export function translateCodon(
  codon: string,
  geneticCode = HUMAN_GENETIC_CODE
): Aminoacids | undefined {
  return geneticCode.code[codon.toUpperCase()];
}

/**
 * This function will merge both transcription and translation directly from DNA to aminoacids chain
 * @param dnaSequence a sequence of a DNA strand
 * @param geneticCode genetic code to use for translation
 * @param offset the nucleotide from which starting the process
 * @returns the aminoacids chain
 */
export function translateDnaSequence(
  dnaSequence: string,
  geneticCode = HUMAN_GENETIC_CODE,
  offset: 0 | 1 | 2 = 0
): string {
  assertValidDna(dnaSequence);
  const sanitizedDna = sanitizeString(dnaSequence);
  const codonLength = Object.keys(geneticCode.code)[0].length;
  let aminoChain = "";
  for (
    let i = offset;
    i < sanitizedDna.length - codonLength + 1;
    i += codonLength
  ) {
    const start = i;
    const end = Math.min(i + codonLength, sanitizedDna.length);
    const codon = sanitizedDna.substring(start, end);
    aminoChain = aminoChain + translateCodon(codon);

    if (end === sanitizedDna.length) break;
  }

  return aminoChain;
}

/**
 * Compute all the potential proteins translatable from a DNA strand.
 * A protein must start with the amino M and end with the stop codon ("_").
 * @param strand
 * @param geneticCode
 * @param offset
 */
export function retrieveProteinsFromDnaStrand(
  strand: string,
  geneticCode: GeneticCode = HUMAN_GENETIC_CODE,
  offset: 0 | 1 | 2 = 0
) {
  assertValidDna(strand);
  const sanitizedDna = sanitizeString(strand);
  const startingAmino = translateCodon(geneticCode.startCodon);
  const aminoChain = translateDnaSequence(sanitizedDna, geneticCode, offset);
  const proteins = [];
  let currentProtein = "";

  for (let i = 0; i < aminoChain.length; i++) {
    if (aminoChain[i] === startingAmino) {
      currentProtein += aminoChain[i];
      continue;
    }

    if (currentProtein.length > 0 && aminoChain[i] === StopCodon) {
      currentProtein += aminoChain[i];
      proteins.push(currentProtein);
      currentProtein = "";
      continue;
    }

    if (currentProtein.length > 0) {
      currentProtein += aminoChain[i];
      continue;
    }
  }

  return proteins;
}

export function retrieveProteinsFromAllDnaReadingFrames(strand: string) {
  assertValidDna(strand);
  const sanitizedStrand = sanitizeString(strand);
  const proteins = [];
  const readingFrames = computeReadingFrames(sanitizedStrand);
  for (const frame of readingFrames) {
    proteins.push(...retrieveProteinsFromDnaStrand(frame));
  }

  return proteins.sort((a, b) => a.length - b.length);
}
