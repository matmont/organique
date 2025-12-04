import { assertValidDna } from "../dna/validation";
import { sanitizeString } from "../utils/string";
import { Aminoacids } from "./ammino";
import { HUMAN_GENETIC_CODE } from "./geneticCode";
import { translateCodon } from "./translation";

export function computeCodonUsage(
  dnaSeq: string,
  ammino: Aminoacids,
  geneticCode = HUMAN_GENETIC_CODE
) {
  assertValidDna(dnaSeq);
  const sanitizedDna = sanitizeString(dnaSeq);
  const codonLength = Object.keys(geneticCode.code)[0].length;
  let total = 0;
  const codonUsage: { [key: string]: number } = {};
  for (let i = 0; i < sanitizedDna.length - codonLength + 1; i += codonLength) {
    const start = i;
    const end = Math.min(i + codonLength, sanitizedDna.length);
    const codon = sanitizedDna.substring(start, end);
    if (translateCodon(codon, geneticCode) === ammino) {
      total += 1;
      codonUsage[codon] = (codonUsage[codon] ?? 0) + 1;
    }

    if (end === sanitizedDna.length) break;
  }

  Object.keys(codonUsage).forEach((key) => (codonUsage[key] /= total));
  return codonUsage;
}
