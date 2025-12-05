export { Aminoacids } from "./ammino";
export {
  GeneticCode,
  HUMAN_GENETIC_CODE,
  StopCodon,
} from "../geneticCode/geneticCode";
export { computeCodonUsage } from "./metrics";
export {
  translateCodon,
  translateDnaSequence,
  retrieveProteinsFromAllDnaReadingFrames,
  retrieveProteinsFromDnaStrand,
} from "./translation";
