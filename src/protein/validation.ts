import { throwInvalidProteinError } from "./errors";

/**
 * Check if a provided string is a valid aminoacid sequence.
 * It is based onf IUPAC codes (https://www.bioinformatics.org/sms/iupac.html)
 * @param seq a string to check
 * @returns true if the string is a valid protein (amino sequence), false otherwise
 */
export function assertValidProtein(seq: string) {
  if (seq.match(/[ACDEFGHIKLMNPQRSTVWYacdefghiklmnpqrstvwy]+/g) === null) {
    throwInvalidProteinError();
  }
}
