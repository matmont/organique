import { ISubstitutionMatrix } from "../utils";
import { throwProteinsNotSameLength } from "./errors";
import { assertValidProtein } from "./validation";

export function fromPrositeToRegExp(prositePattern: string): RegExp {
  let regexp = `${prositePattern}`;

  regexp = regexp.replaceAll(/{/g, "[^");
  regexp = regexp.replaceAll(/}/g, "]");
  regexp = regexp.replaceAll(/\(/g, "{");
  regexp = regexp.replaceAll(/\)/g, "}");
  regexp = regexp.replaceAll(/x/g, ".");
  regexp = regexp.replaceAll(/-/g, "");

  return new RegExp(regexp, "g");
}

export function isMotifsFound(aminoChain: string, motif: RegExp) {
  return aminoChain.match(motif) != null;
}

/**
 * Compute the similarity score between two proteins based on the provided substitution matrix.
 * @param protA first protein
 * @param protB second protein
 * @param subMatrix substitution matrix to use
 * @returns the score (or penalty) as defined by the substitution matrix
 */
export function computeProteinSimilarity(
  protA: string,
  protB: string,
  subMatrix: ISubstitutionMatrix
) {
  const sanitizedProtA = protA.replaceAll(/\s+/g, "").toUpperCase();
  const sanitizedProtB = protB.replaceAll(/\s+/g, "").toUpperCase();
  assertValidProtein(sanitizedProtA);
  assertValidProtein(sanitizedProtB);

  if (sanitizedProtA.length !== sanitizedProtB.length) {
    throwProteinsNotSameLength();
  }

  let amount = 0;
  for (let i = 0; i < sanitizedProtA.length; i++) {
    const indexA = subMatrix.legend.indexOf(sanitizedProtA[i]);
    const indexB = subMatrix.legend.indexOf(sanitizedProtB[i]);
    amount += subMatrix.matrix[indexA][indexB];
  }

  return amount;
}
