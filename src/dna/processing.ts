import { sanitizeString } from "../utils/string";
import { assertValidDna } from "./validation";

/**
 * Compute the opposite-strand of the provided one. Note
 * that this means computing not only a complementary sequence but also
 * a reversed one, due to the double-helix structure of the DNA.
 * @param strand the DNA strand from which compute the verse complement
 * @returns the reverse complement of the provided strand
 * @throws An error if the provided dnaSequence is not valid
 */
export function computeReverseComplement(strand: string) {
  assertValidDna(strand);

  let revCompl = "";
  for (const base of sanitizeString(strand)) {
    if (base === "A") revCompl = "T" + revCompl;
    if (base === "T") revCompl = "A" + revCompl;
    if (base === "C") revCompl = "G" + revCompl;
    if (base === "G") revCompl = "C" + revCompl;
  }

  return revCompl;
}

/**
 * https://en.wikipedia.org/wiki/Reading_frame
 *
 */
export function computeReadingFrames(strand: string) {
  assertValidDna(strand);
  const sanitizedDna = sanitizeString(strand);

  const readingFrames = [];
  readingFrames.push(sanitizedDna);
  readingFrames.push(sanitizedDna.slice(1));
  readingFrames.push(sanitizedDna.slice(2));
  const reverseComplement = computeReverseComplement(sanitizedDna);
  readingFrames.push(reverseComplement);
  readingFrames.push(reverseComplement.slice(1));
  readingFrames.push(reverseComplement.slice(2));

  return readingFrames;
}
