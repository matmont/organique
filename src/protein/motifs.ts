import { ISubstitutionMatrix } from "../utils";
import { Aminoacids } from "./ammino";
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
 * Given a Prosite formatted pattern, this function converts it into a RegExp and search for the pattern in the provided string
 * @param aminoChain the query sequence
 * @param motif the pattern to search for
 * @returns the indices of the findings, an empty array if the patter is not found
 */
export function findPrositeMotifs(aminoChain: string, motif: string) {
  assertValidProtein(aminoChain);
  const regexp = fromPrositeToRegExp(motif);
  return [...aminoChain.matchAll(regexp)].map((m) => m.index);
}

/**
 * Compute the similarity score between two proteins based on the provided substitution matrix.
 * @param protA first protein
 * @param protB second protein
 * @param subMatrix substitution matrix to use
 * @param gapPenalty g costant for gap penalty
 * @returns the score (or penalty) as defined by the substitution matrix
 */
export function computeProteinSimilarity(
  protA: string,
  protB: string,
  subMatrix: ISubstitutionMatrix,
  gapPenalty: number
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
    if (
      sanitizedProtA[i] === Aminoacids.GapAmino ||
      sanitizedProtB[i] === Aminoacids.GapAmino
    ) {
      amount += gapPenalty;
      continue;
    }
    const indexA = subMatrix.legend.indexOf(sanitizedProtA[i]);
    const indexB = subMatrix.legend.indexOf(sanitizedProtB[i]);
    amount += subMatrix.matrix[indexA][indexB];
  }

  return amount;
}
