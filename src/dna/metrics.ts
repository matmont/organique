/**
 * Computes the GC content of a DNA sequence.
 *
 * https://en.wikipedia.org/wiki/GC-content
 * @param dnaSequence a DNA sequence string
 * @returns the GC content as a fraction between 0 and 1
 */
export function computeGCContent(dnaSequence: string): number {
  if (dnaSequence.length === 0) return 0;

  const sanitizedDna = dnaSequence.trim().toUpperCase();
  const gcCount = (sanitizedDna.match(/GC/g) || []).length;
  return gcCount / sanitizedDna.length;
}
