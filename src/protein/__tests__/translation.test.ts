// dna-translation.test.js
import test from "node:test";
import assert from "node:assert";

import {
  translateCodon,
  retrieveProteinsFromDnaStrand,
  translateDnaSequence,
  retrieveProteinsFromAllDnaReadingFrames,
} from "../translation.ts";
import { HUMAN_GENETIC_CODE, StopCodon } from "../../geneticCode";
import { Aminoacids } from "../ammino.ts";

const buildDnaFromAminoChain = (
  aminoChain: Aminoacids[],
  geneticCode = HUMAN_GENETIC_CODE
) => {
  const entries = Object.entries(geneticCode.code);

  return aminoChain
    .map((symbol) => {
      const entry = entries.find(([, value]) => value === symbol);
      if (!entry) {
        throw new Error(`No codon found for symbol ${String(symbol)}`);
      }
      const [codon] = entry;
      return codon;
    })
    .join("");
};

/* -------------------------------------------------------------------------- */
/*                                 translateCodon                             */
/* -------------------------------------------------------------------------- */

test("translateCodon translates a known codon to the correct amino acid", () => {
  // GCT is Alanine in the standard genetic code
  const amino = translateCodon("GCT", HUMAN_GENETIC_CODE);
  assert.equal(amino, Aminoacids.Alanine);
});

test("translateCodon is case-insensitive on the codon string", () => {
  const upper = translateCodon("GCT", HUMAN_GENETIC_CODE);
  const lower = translateCodon("gct", HUMAN_GENETIC_CODE);
  assert.equal(lower, upper);
});

test("translateCodon returns undefined for an unknown / invalid codon", () => {
  const amino = translateCodon("NNN", HUMAN_GENETIC_CODE);
  assert.equal(amino, undefined);
});

/* -------------------------------------------------------------------------- */
/*                              translateDnaSequence                          */
/* -------------------------------------------------------------------------- */

test("translateDnaSequence translates a full DNA sequence in frame", () => {
  // ATG GAA TTT TAA
  const dna = "ATGGAATTTTAA";

  const expected = ["ATG", "GAA", "TTT", "TAA"]
    .map((codon) => HUMAN_GENETIC_CODE.code[codon])
    .join("");

  const result = translateDnaSequence(dna, HUMAN_GENETIC_CODE, 0);

  assert.equal(result, expected);
});

test("translateDnaSequence accepts lowercase / dirty input thanks to sanitizeString", () => {
  const dnaUpper = "ATGGAATTTTAA";
  const dnaLower = "atggaattttaa";

  const resUpper = translateDnaSequence(dnaUpper, HUMAN_GENETIC_CODE, 0);
  const resLower = translateDnaSequence(dnaLower, HUMAN_GENETIC_CODE, 0);

  assert.equal(resLower, resUpper);
});

test("translateDnaSequence respects the reading-frame offset", () => {
  // ATG ATG ATG
  // 0: ATG | ATG | ATG
  // 1: TGA | TGA
  // 2: GAT | GAT
  //
  // Assuming standard human code:
  // - ATG  -> start (M)
  // - TGA  -> StopCodon
  // - GAT  -> Aspartic acid (D)
  const dna = "ATGATGATG";

  const startAmino = translateCodon(
    HUMAN_GENETIC_CODE.startCodon,
    HUMAN_GENETIC_CODE
  );
  const result0 = translateDnaSequence(dna, HUMAN_GENETIC_CODE, 0);
  const result1 = translateDnaSequence(dna, HUMAN_GENETIC_CODE, 1);
  const result2 = translateDnaSequence(dna, HUMAN_GENETIC_CODE, 2);

  // Frame 0: "MMM"
  assert.equal(result0, `${startAmino}${startAmino}${startAmino}`);

  // Frame 1: "StopStop"
  assert.equal(result1, `${StopCodon}${StopCodon}`);

  // Frame 2: "DD" (AsparticAcid twice)
  assert.equal(result2, `${Aminoacids.AsparticAcid}${Aminoacids.AsparticAcid}`);
});

/* -------------------------------------------------------------------------- */
/*                         retrieveProteinsFromDnaStrand                      */
/* -------------------------------------------------------------------------- */

test("retrieveProteinsFromDnaStrand returns a single protein for a simple strand", () => {
  const startAmino = translateCodon(
    HUMAN_GENETIC_CODE.startCodon,
    HUMAN_GENETIC_CODE
  )!;

  // Build a chain: M - E - F - Stop
  const proteinChain: Aminoacids[] = [
    startAmino,
    Aminoacids.GlutamicAcid,
    Aminoacids.Phenylalanine,
    Aminoacids.StopAmino,
  ];

  const dna = buildDnaFromAminoChain(proteinChain, HUMAN_GENETIC_CODE);

  const proteins = retrieveProteinsFromDnaStrand(dna, HUMAN_GENETIC_CODE, 0);

  const expectedProtein = proteinChain.join("");
  assert.deepEqual(proteins, [expectedProtein]);
});

test("retrieveProteinsFromDnaStrand returns multiple proteins from the same strand", () => {
  const startAmino = translateCodon(
    HUMAN_GENETIC_CODE.startCodon,
    HUMAN_GENETIC_CODE
  )!;

  // Protein 1: M - E - F - Stop
  const protein1 = [
    startAmino,
    Aminoacids.GlutamicAcid,
    Aminoacids.Phenylalanine,
    Aminoacids.StopAmino,
  ];

  // Protein 2: M - V - Stop
  const protein2 = [startAmino, Aminoacids.Valine, Aminoacids.StopAmino];

  const dna = buildDnaFromAminoChain(
    [...protein1, ...protein2],
    HUMAN_GENETIC_CODE
  );

  const proteins = retrieveProteinsFromDnaStrand(dna, HUMAN_GENETIC_CODE, 0);

  const expected = [protein1.join(""), protein2.join("")];
  assert.deepEqual(proteins, expected);
});

test("retrieveProteinsFromDnaStrand returns empty array when no start amino is present", () => {
  // A - G - Stop (no Methionine / start amino)
  const chain = [Aminoacids.Alanine, Aminoacids.Glycine, Aminoacids.StopAmino];
  const dna = buildDnaFromAminoChain(chain, HUMAN_GENETIC_CODE);
  const proteins = retrieveProteinsFromDnaStrand(dna, HUMAN_GENETIC_CODE, 0);

  assert.deepEqual(proteins, []);
});

/* -------------------------------------------------------------------------- */
/*              retrieveProteinsFromAllDnaReadingFrames - tests               */
/* -------------------------------------------------------------------------- */

test("retrieveProteinsFromAllDnaReadingFrames aggrega le proteine da tutti i reading frame e le ordina per lunghezza", () => {
  const startAmino = translateCodon(
    HUMAN_GENETIC_CODE.startCodon,
    HUMAN_GENETIC_CODE
  )!;

  // Protein 1: M - E - F - Stop
  const protein1 = [
    startAmino,
    Aminoacids.GlutamicAcid,
    Aminoacids.Phenylalanine,
    Aminoacids.StopAmino,
  ];

  // Protein 2: M - V - Stop (più corta)
  const protein2 = [startAmino, Aminoacids.Valine, Aminoacids.StopAmino];

  // Costruiamo una singola sequenza di DNA che contenga le due proteine back-to-back
  const dna = buildDnaFromAminoChain(
    [...protein1, ...protein2],
    HUMAN_GENETIC_CODE
  );

  const expectedLong = protein1.join("");
  const expectedShort = protein2.join("");

  const proteins = retrieveProteinsFromAllDnaReadingFrames(dna);

  // Deve contenere almeno queste due proteine
  assert.ok(
    proteins.includes(expectedShort),
    `Expected proteins to contain short protein ${expectedShort}, got: ${JSON.stringify(
      proteins
    )}`
  );
  assert.ok(
    proteins.includes(expectedLong),
    `Expected proteins to contain long protein ${expectedLong}, got: ${JSON.stringify(
      proteins
    )}`
  );

  // Deve essere ordinato per lunghezza crescente
  for (let i = 1; i < proteins.length; i++) {
    assert.ok(
      proteins[i - 1].length <= proteins[i].length,
      `Proteins are not sorted by length: ${proteins[i - 1]} (${
        proteins[i - 1].length
      }) before ${proteins[i]} (${proteins[i].length})`
    );
  }

  // E, in particolare, la proteina più corta deve apparire prima di quella più lunga
  const idxShort = proteins.indexOf(expectedShort);
  const idxLong = proteins.indexOf(expectedLong);
  assert.ok(idxShort !== -1 && idxLong !== -1);
  assert.ok(
    idxShort < idxLong,
    `Shorter protein should appear before longer one. got indices: short=${idxShort}, long=${idxLong}`
  );
});

test("retrieveProteinsFromAllDnaReadingFrames solleva un errore con DNA non valido", () => {
  // dipende da assertValidDna, ma in generale verifichiamo che lanci
  assert.throws(() => {
    retrieveProteinsFromAllDnaReadingFrames("XYZ123");
  });
});
