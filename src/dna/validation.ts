import { throwInvalidDnaError } from "./errors";

/**
 * Check if a provided string is a valid DNA sequence.
 * @param seq a string to check
 * @returns true if the string is a valid DNA sequence, false otherwise
 */
export function assertValidDna(seq: string) {
  if (seq.match(/[ACTGactg]+/g) === null) {
    throwInvalidDnaError();
  }
}
