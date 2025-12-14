import { HierarchicalAgglomerativeClustering } from "../clustering";
import {
  Matrix,
  needlemanWunshAlgorithm,
  NodeTree,
  readSubstitutionMatrix,
} from "../utils";

/**
 * This is an implementation of the distance-based method UPGMA (Unweighted Pair Group Method with Arithmetic Mean)
 * to generate a phylogenetic tree from a set of sequences.
 *
 * The function takes an array of sequences as input, it computes a distance matrix based on number of
 * characters mismatch in the (globally) aligned pairs (NeedlemanWunsch) and returns a Phylogenetic tree through
 * the NodeTree class of this library.
 *
 *
 * @param sequences an array of sequences from which to generate the phylogenetic tree
 * @returns the generated phylogenetic tree
 */
export async function generatePhyloTree(
  sequences: string[]
): Promise<NodeTree<string>> {
  const distanceMatrix = new Matrix(
    sequences.length,
    sequences.length,
    Infinity
  );

  const substitutionMatrix = await readSubstitutionMatrix("BLOSUM62");

  for (let i = 0; i < sequences.length; i++) {
    for (let j = 0; j < i; j++) {
      const { alignedSequenceA, alignedSequenceB } = needlemanWunshAlgorithm(
        sequences[i],
        sequences[j],
        substitutionMatrix,
        -1,
        "-"
      );
      const numberOfMismatches = alignedSequenceA
        .split("")
        .reduce(
          (acc, char, index) =>
            char !== alignedSequenceB[index] ? acc + 1 : acc,
          0
        );

      distanceMatrix.setValue(i, j, numberOfMismatches);
    }
  }

  return HierarchicalAgglomerativeClustering(distanceMatrix, "average");
}
