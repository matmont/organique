import { assertValidDna } from "../dna/validation";
import { sanitizeString } from "../utils/string";

/**
 * Transcribe a new RNA from a DNA strand.
 * If the sense strand (coding strand) is provided, the transcription is just a replacement of T bases with U.
 * If the anti-sense (template strand) strand is provided, the transcription will be performed in reverse direction, given that the transcription process is always held in sense direction.
 * @param dnaSequence the DNA strand from which transcribe
 * @param strandType the direction of the DNA strand provided
 * @returns the transcribed RNA as a sequence of character
 * @throws An error if the provided dnaSequence is not valid
 */
export function transcribeFromDna(
  dnaSequence: string,
  strandType: "coding" | "template" = "coding"
): string {
  assertValidDna(dnaSequence);

  if (strandType === "coding") {
    return sanitizeString(dnaSequence).replace("T", "U");
  }

  let rna = "";
  for (const base of sanitizeString(dnaSequence)) {
    if (base === "A") rna = "U" + rna;
    if (base === "T") rna = "A" + rna;
    if (base === "C") rna = "C" + rna;
    if (base === "G") rna = "G" + rna;
  }

  return rna;
}
