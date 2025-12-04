export * as dna from "./dna";
export * as protein from "./protein";
export * as rna from "./rna";
export * as utils from "./utils";

import { computeReadingFrames } from "./dna/processing";
import { Aminoacids } from "./protein/ammino";
import { computeCodonUsage } from "./protein/metrics";
import { retrieveProteinsFromDnaStrand } from "./protein/translation";

console.log(retrieveProteinsFromDnaStrand("ATGCGTA"));
