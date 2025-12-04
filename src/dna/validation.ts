import { sanitizeString } from "../utils/string";
import { throwInvalidDnaError } from "./errors";

/**
 * Check if a provided string is a valid DNA sequence.
 * @param seq a string to check
 * @returns true if the string is a valid DNA sequence, false otherwise
 */
export function assertValidDna(seq: string) {
  const validNucleotides = new Set(["A", "T", "C", "G"]);
  for (const char of sanitizeString(seq)) {
    if (!validNucleotides.has(char.toUpperCase())) {
      throwInvalidDnaError();
    }
  }
}
