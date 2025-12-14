import { Matrix, NodeTree } from "../utils";

/**
 * Given a Distance Matrix in input, derive the Dendogram associated with it
 * through Hierarchical Agglomerative Clustering (i.e., bottom up).
 *
 * The returning dendogram will have leaves identified by the row index containing
 * the sequence. E.g., "Seq0" for the first row, "Seq1" for the second row, and so on.
 * The internal nodes will not have any specific labelling.
 *
 * https://www.geeksforgeeks.org/machine-learning/hierarchical-clustering/
 *
 * @param distanceMatrix The distance matrix to use for clustering, it is expected to be lower triangular, with Infinity in the diagonal and the upper part.
 * @returns The root node of the dendogram representing the hierarchical clustering
 */
export function HierarchicalAgglomerativeClustering(
  distanceMatrix: Matrix,
  linkageType: "maximum" | "average" | "minimum"
): NodeTree<string> {
  checkForLowerTriangularMatrix(distanceMatrix);

  // The fringe contains nodes that are yet to be clustered (sequences or already clustered sequences)
  const fringe: NodeTree<string>[] = [];
  for (let i = 0; i < distanceMatrix.rows; i++) {
    fringe.push(new NodeTree(`Seq${i}`));
  }
  const _distanceMatrix = distanceMatrix.copyMatrix();
  for (let i = _distanceMatrix.rows - 1; i > 0; i--) {
    _distanceMatrix.printMatrix();
    const { col, row } = _distanceMatrix.getMinPosition();
    const cluster = new NodeTree<string>(
      `Dist${_distanceMatrix.getValue(row, col)! / 2}`,
      fringe[row],
      fringe[col]
    );

    if (i < 2) return cluster; // root cluster node

    // const rowToMerge = fringe[row];
    // const colToMerge = fringe[col];

    const newClusterRow: number[] = [];
    for (let k = 0; k < _distanceMatrix.rows; k++) {
      if (k !== row && k !== col) {
        /**
         * Given that the matrix is lower triangular, the only values we
         * care about is the ones below the diagonal (i.e., i > j).
         */
        const distToMergedRow = _distanceMatrix.getValue(
          Math.max(row, k),
          Math.min(row, k)
        )!;
        const distToMergedCol = _distanceMatrix.getValue(
          Math.max(col, k),
          Math.min(col, k)
        )!;
        const newDist = computeDistFromNewCluster(
          distToMergedRow,
          distToMergedCol,
          linkageType
        );
        newClusterRow.push(newDist);
      }
    }

    _distanceMatrix.removeRow(row);
    _distanceMatrix.removeColumn(row);
    _distanceMatrix.removeColumn(col);
    _distanceMatrix.removeRow(col);
    _distanceMatrix.addRow(newClusterRow);
    _distanceMatrix.addColumn(1000); // placeholder for new cluster

    if (row < col) {
      fringe.splice(col, 1);
      fringe.splice(row, 1);
    } else {
      fringe.splice(row, 1);
      fringe.splice(col, 1);
    }
    fringe.push(cluster);

    console.log();
    console.log();
  }

  throw new Error("Clustering failed");
}

function computeDistFromNewCluster(
  distFromFirstSet: number,
  distFromSecondSet: number,
  linkageType: string
): number {
  switch (linkageType) {
    case "average":
      return (distFromFirstSet + distFromSecondSet) / 2;
    case "maximum":
      return Math.max(distFromFirstSet, distFromSecondSet);
    case "minimum":
      return Math.min(distFromFirstSet, distFromSecondSet);
    default:
      throw new Error(`Unknown linkage type: ${linkageType}`);
  }
}

function checkForLowerTriangularMatrix(matrix: Matrix) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = i + 1; j < matrix.cols; j++) {
      const value = matrix.getValue(i, j);
      if (value !== 0 && value !== null && value !== Infinity) {
        throw new Error(
          "This method expect a lower triangular distance matrix as input with Infinity in the upper triangular part (and diagonal)."
        );
      }
    }
  }
}
