export class NodeTree<K extends Object> {
  value: K | null;
  subLeft: NodeTree<K> | null;
  subRight: NodeTree<K> | null;
  valueFormatter: ((value: K) => string) | undefined;

  constructor(
    value: K,
    subLeft: NodeTree<K> | null = null,
    subRight: NodeTree<K> | null = null,
    valueFormatter?: (value: K) => string
  ) {
    this.value = value;
    this.subLeft = subLeft;
    this.subRight = subRight;
    this.valueFormatter = valueFormatter;
  }

  printTree() {
    this.#printRecursive();
  }

  retrieveTerminalNodes() {
    const recursiveDef = (node: NodeTree<K>) => {
      if (node.subLeft === null && node.subRight === null) {
        return [node];
      }
      let terminals: NodeTree<K>[] = [];
      if (node.subLeft) {
        terminals = terminals.concat(recursiveDef(node.subLeft));
      }
      if (node.subRight) {
        terminals = terminals.concat(recursiveDef(node.subRight));
      }
      return terminals;
    };

    return recursiveDef(this);
  }

  #formatValue(): string {
    if (this.valueFormatter && this.value !== null) {
      return this.valueFormatter(this.value);
    }
    return this.value !== null ? this.value.toString() : "no-value";
  }

  #printRecursive(level: number = 0, prefix: string = "") {
    const formattedValue = this.#formatValue();
    const tabs = " ".repeat(level * 4);
    if (level === 0) console.log(formattedValue);
    else console.log(`${tabs}--> ${prefix}${formattedValue}`);
    if (this.subLeft) {
      this.subLeft.#printRecursive(level + 1, "[L] ");
    }
    if (this.subRight) {
      this.subRight.#printRecursive(level + 1, "[R] ");
    }
  }
}
