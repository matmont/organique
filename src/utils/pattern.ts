/**
 * Compute the Longest Prefix Suffix array of a pattern.
 * For each position i in the pattern, lps[i] stores the length of the longest proper prefix which is also a suffix in the substring pat[0...i].
 *
 * For more info: https://www.baeldung.com/cs/knuth-morris-pratt
 *
 * @param pattern
 * @returns
 */
export function computeLpsArray(pattern: string): number[] {
  const length = pattern.length;
  const lps = new Array(length).fill(0);

  let longestPrefixLen = 0;
  let i = 1;

  while (i < length) {
    if (pattern[i] === pattern[longestPrefixLen]) {
      longestPrefixLen++;
      lps[i] = longestPrefixLen;
      i++;
      continue;
    }

    if (longestPrefixLen !== 0) {
      longestPrefixLen = lps[longestPrefixLen - 1];
      continue;
    }

    if (longestPrefixLen === 0) {
      lps[i] = 0;
      i++;
    }
  }

  return lps;
}

/**
 * Computes all the occurrences of a pattern in a string.
 * @param str The string to search upon
 * @param pattern A pattern to find
 * @returns An array of indices stating the starting position of the pattern occurrence in the string
 */
export function findOccurrences(str: string, pattern: string): number[] {
  if (!str?.length || !pattern?.length) return [];

  const lps = computeLpsArray(pattern);

  const occurrences = [];
  let i = 0;
  let j = 0;

  while (i < str.length) {
    if (str[i] === pattern[j]) {
      i++;
      j++;

      if (j === pattern.length) {
        occurrences.push(i - j);
        j = lps[j - 1];
      }

      continue;
    }

    if (str[i] !== pattern[j]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return occurrences;
}
