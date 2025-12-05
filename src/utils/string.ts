/**
 * Sanitizes a given string by trimming whitespace and converting to uppercase.
 *
 * @param input a raw string
 * @returns a sanitized string
 */
export function sanitizeString(input: string): string {
  if (!input?.length) return "";
  return input.trim().toUpperCase();
}

/**
 * Counts occurrences of symbols of a given length in a string.
 *
 * @param input a string from which to count symbol occurrences
 * @param symLength length of the symbols to count (default is 1, e.g., DNA nucleotides)
 * @returns a dictionary-like structure with all the occurrences of the distinct symbols
 */
export function countSymbolsOccurrence(
  input: string,
  symLength: number = 1
): Record<string, number> {
  const occurrences: Record<string, number> = {};
  const sanitizedInput = sanitizeString(input);
  for (let i = 0; i < input.length; i++) {
    if ((i + 1) % symLength === 0) {
      const symbol = sanitizedInput.slice(i - symLength + 1, i + 1);
      occurrences[symbol] = (occurrences[symbol] || 0) + 1;
    }
  }
  return occurrences;
}

/**
 * Iterates over substrings of a given length in a string and applies a provided function to each substring.
 * @param str a string to iterate over
 * @param subLength length of each substring
 * @param func a function to apply to each substring
 */
export function forEachSubstring(
  str: string,
  subLength: number,
  func: (substr: string) => void
) {
  let isEnd = false;
  let i = 0;
  while (!isEnd) {
    const start = i;
    const end = Math.min(i + subLength, str.length);
    if (end === str.length) {
      isEnd = true;
    }
    const substr = str.slice(start, end);
    func(substr);
    i += subLength;
  }
}
