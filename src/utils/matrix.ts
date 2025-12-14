// I'll keep it numeric type for simplicity, but it can be made generic if needed
export class Matrix {
  #data: number[][];
  #rows: number;
  #cols: number;

  constructor(rows: number, cols: number, fillValue: number = 0) {
    this.#data = Array.from({ length: rows }, () =>
      Array(cols).fill(fillValue)
    );
    this.#rows = rows;
    this.#cols = cols;
  }

  #isOutOfBounds(row: number, col: number): boolean {
    return row < 0 || row >= this.#rows || col < 0 || col >= this.#cols;
  }

  printMatrix() {
    for (let i = 0; i < this.#rows; i++) {
      console.log(this.#data[i].join(" "));
    }
    console.log();
  }

  getValue(row: number, col: number): number | null {
    if (this.#isOutOfBounds(row, col)) {
      console.warn("Index out of bounds");
      return null;
    }
    return this.#data[row][col];
  }

  setValue(row: number, col: number, value: number): boolean {
    if (this.#isOutOfBounds(row, col)) {
      console.warn("Index out of bounds");
      return false;
    }
    this.#data[row][col] = value;
    return true;
  }

  get rows(): number {
    return this.#rows;
  }

  get cols(): number {
    return this.#cols;
  }

  getMinValue(): number {
    const minByRows = this.#data.map((row) => Math.min(...row));
    const min = Math.min(...minByRows);
    return min;
  }

  getMinPosition(): { row: number; col: number } {
    let min = Infinity;
    let position: { row: number; col: number } = { row: -1, col: -1 };
    // TODO: convert with reduce
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#cols; j++) {
        if (this.#data[i][j] < min) {
          min = this.#data[i][j];
          position = { row: i, col: j };
        }
      }
    }
    return position;
  }

  addRow(newRow: number[] = []) {
    this.#data.push(
      newRow.length === this.#cols ? newRow : Array(this.#cols).fill(0)
    );
    this.#rows += 1;
  }

  addColumn(fillValue: number = 0) {
    for (let i = 0; i < this.#rows; i++) {
      this.#data[i].push(fillValue);
    }
    this.#cols += 1;
  }

  removeRow(row: number): boolean {
    if (row < 0 || row >= this.#rows) {
      console.warn("Row index out of bounds");
      return false;
    }
    this.#data.splice(row, 1);
    this.#rows -= 1;
    return true;
  }

  removeColumn(col: number): boolean {
    if (col < 0 || col >= this.#cols) {
      console.warn("Column index out of bounds");
      return false;
    }
    for (let i = 0; i < this.#rows; i++) {
      this.#data[i].splice(col, 1);
    }
    this.#cols -= 1;
    return true;
  }

  copyMatrix(): Matrix {
    const newMatrix = new Matrix(this.#rows, this.#cols);
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#cols; j++) {
        newMatrix.setValue(i, j, this.#data[i][j]);
      }
    }
    return newMatrix;
  }
}
