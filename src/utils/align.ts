import { readSync } from "fs";
import { Aminoacids } from "../protein/ammino";
import { ISubstitutionMatrix, readSubstitutionMatrix } from "./similarity";

/**
 * Algorithm NeedlemanWunsh for global alignment of sequences.
 * https://en.wikipedia.org/wiki/Needleman%E2%80%93Wunsch_algorithm
 *
 * @param seqA the sequence that will be mapped to the rows
 * @param seqB the sequence that will be mapped to the cols
 * @param substitutionMatrix the substitution matrix to use
 * @param gapPenalty the constant gap penalty to use
 * @param gapSymbol the gap symbol to use while reconstructing the alignment. Defaults to Amino.GapSymbol (of Human Genetic Code)
 * @returns [alignedSeqA, alignedSeqB, S matrix, T matrix]
 */
export function needlemanWunshAlgorithm(
  seqA: string,
  seqB: string,
  substitutionMatrix: ISubstitutionMatrix,
  gapPenalty: number,
  gapSymbol: string = Aminoacids.GapAmino
) {
  const n = seqA.length;
  const m = seqB.length;
  const S: number[][] = [];
  const T: string[][] = [];

  // Init S and T
  const allGapsRow = [];
  const startingRow = [];
  const allEmptyStringRow = [];
  const allLeftRow = [];
  for (let j = 0; j < m + 1; j++) {
    allGapsRow.push(gapPenalty * j);
    startingRow.push(-Infinity);
    allLeftRow.push("LEFT");
    allEmptyStringRow.push("");
  }
  for (let i = 0; i < n + 1; i++) {
    if (i === 0) {
      S[0] = allGapsRow;
      T[0] = allLeftRow;
      continue;
    }
    S[i] = Array.from(startingRow);
    T[i] = Array.from(allEmptyStringRow);
    S[i][0] = gapPenalty * i;
    T[i][0] = "UP";
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const up = S[i - 1][j] + gapPenalty;
      const left = S[i][j - 1] + gapPenalty;
      const diag =
        S[i - 1][j - 1] +
        substitutionMatrix.matrix[
          substitutionMatrix.legend.indexOf(seqA[i - 1])
        ][substitutionMatrix.legend.indexOf(seqB[j - 1])];
      S[i][j] = Math.max(up, left, diag);
      if (S[i][j] === up) {
        T[i][j] = "UP";
      }
      if (S[i][j] === left) {
        T[i][j] = "LEFT";
      }
      if (S[i][j] === diag) {
        T[i][j] = "DIAG";
      }
    }
  }

  let alignedSequenceA = "";
  let alignedSequenceB = "";

  const recursiveFn = (i: number, j: number) => {
    if (i === 0 && j === 0) {
      return;
    }

    if (T[i][j] === "UP") {
      alignedSequenceA = seqA[i - 1] + alignedSequenceA;
      alignedSequenceB = gapSymbol + alignedSequenceB;
      recursiveFn(i - 1, j);
    }
    if (T[i][j] === "DIAG") {
      alignedSequenceA = seqA[i - 1] + alignedSequenceA;
      alignedSequenceB = seqB[j - 1] + alignedSequenceB;
      recursiveFn(i - 1, j - 1);
    }
    if (T[i][j] === "LEFT") {
      alignedSequenceA = gapSymbol + alignedSequenceA;
      alignedSequenceB = seqB[j - 1] + alignedSequenceB;
      recursiveFn(i, j - 1);
    }
  };

  recursiveFn(n, m);

  return [alignedSequenceA, alignedSequenceB, S, T];
}

export function smithWatermanAlgorithm(
  seqA: string,
  seqB: string,
  substitutionMatrix: ISubstitutionMatrix,
  gapPenalty: number,
  gapSymbol: string = Aminoacids.GapAmino
) {
  const n = seqA.length;
  const m = seqB.length;
  const S: number[][] = [];
  const T: string[][] = [];

  // Init S and T
  const allZeros = [];
  const allEmptyStringRow = [];
  for (let j = 0; j < m + 1; j++) {
    allZeros.push(0);
    allEmptyStringRow.push("");
  }
  for (let i = 0; i < n + 1; i++) {
    S[i] = Array.from(allZeros);
    T[i] = Array.from(allEmptyStringRow);
  }

  let maxValue = -Infinity;
  let maxValueRow = -1;
  let maxValueCol = -1;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const up = S[i - 1][j] + gapPenalty;
      const left = S[i][j - 1] + gapPenalty;
      const diag =
        S[i - 1][j - 1] +
        substitutionMatrix.matrix[
          substitutionMatrix.legend.indexOf(seqA[i - 1])
        ][substitutionMatrix.legend.indexOf(seqB[j - 1])];
      S[i][j] = Math.max(up, left, diag, 0);
      if (S[i][j] > maxValue) {
        maxValue = S[i][j];
        maxValueCol = j;
        maxValueRow = i;
      }

      if (S[i][j] === up) {
        T[i][j] = "UP";
      }
      if (S[i][j] === left) {
        T[i][j] = "LEFT";
      }
      if (S[i][j] === diag) {
        T[i][j] = "DIAG";
      }
      if (S[i][j] === 0) {
        T[i][j] = "CUT";
      }
    }
  }

  let alignedSequenceA = "";
  let alignedSequenceB = "";

  const recursiveFn = (i: number, j: number) => {
    if (i === 0 && j === 0) {
      return;
    }

    if (T[i][j] === "UP") {
      alignedSequenceA = seqA[i - 1] + alignedSequenceA;
      alignedSequenceB = gapSymbol + alignedSequenceB;
      recursiveFn(i - 1, j);
    }
    if (T[i][j] === "DIAG") {
      alignedSequenceA = seqA[i - 1] + alignedSequenceA;
      alignedSequenceB = seqB[j - 1] + alignedSequenceB;
      recursiveFn(i - 1, j - 1);
    }
    if (T[i][j] === "LEFT") {
      alignedSequenceA = gapSymbol + alignedSequenceA;
      alignedSequenceB = seqB[j - 1] + alignedSequenceB;
      recursiveFn(i, j - 1);
    }

    if (T[i][j] === "CUT") {
      return;
    }
  };

  recursiveFn(maxValueRow, maxValueCol);

  return [alignedSequenceA, alignedSequenceB, S, T];
}
