# 🧬 organique

A modern, lightweight bioinformatics toolkit for Node.js --- designed as
an alternative to [BioPython](https://biopython.org/) for the JavaScript ecosystem.

## Overview

**organique** is a modular bioinformatics library built for JavaScript and
TypeScript.\
It offers tools for DNA validation, transcription, translation, and
protein extraction, with a clean and intuitive API.

The project was created as part of a bioinformatics course, but it is
structured as a real open-source package suitable for developers and
researchers.

## Features

- DNA validation and sanitization
- DNA → RNA transcription
- Configurable codon translation
- ORF parsing
- Protein extraction from DNA strands
- Pattern Matching utilities
  - Knuth-Morris-Pratt Algorithm implementation (prefer native `RegExp` when possible)
- TypeScript-first API
- Works with Node 20+ (ESM)

## Installation

```sh
npm install organique
```

## Usage Examples

TODO

<!--
### Translate a codon

```ts
import { translateCodon, HUMAN_GENETIC_CODE } from "bioseq.js";

console.log(translateCodon("ATG"));
// "M" (Methionine)
```

### Translate a full DNA sequence

```ts
import { translateDnaSequence } from "bioseq.js";

const dna = "ATGGAATTTTAA";
const protein = translateDnaSequence(dna);

console.log(protein);
// "MEF_"
```

### Retrieve all proteins from a DNA strand

```ts
import { retrieveProteinsFromDnaStrand } from "bioseq.js";

const proteins = retrieveProteinsFromDnaStrand("CCCATGGAATTTTAAATGTTTTAG");

console.log(proteins);
// ["MEF_", "MF_"]
```

## Genetic Code Support

The library includes the standard human genetic code, and also allows
custom maps:

```ts
const custom = {
  startCodon: "ATG",
  code: {
    /* ... */
  },
};

translateDnaSequence("ATGAAA", custom);
```

## Project Structure

    src/
      dna/
        validation.ts
      utils/
        string.ts
      translation/
        geneticCode.ts
        translateCodon.ts
        translateDnaSequence.ts
        retrieveProteins.ts
    tests/
      *.test.ts -->

## Running Tests

```sh
npm test
```

## Roadmap

- FASTA and FASTQ file support
- RNA secondary structure tools
- Codon usage tables
- Alignment utilities
- Additional genetic codes (mitochondrial, bacterial, etc.)

## Contributing

Contributions are welcome.
Please fork the repo, create a feature branch, add tests, and submit a
pull request.

## License

MIT License.

## Author

Developed educational and research purposes, with the goal
of making bioinformatics more accessible in the JavaScript ecosystem.
