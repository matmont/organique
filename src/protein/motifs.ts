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
