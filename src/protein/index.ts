import { readSubstitutionMatrix } from "../utils";
import { computeProteinSimilarity } from "./motifs";

export {
  fromPrositeToRegExp,
  isMotifsFound,
  computeProteinSimilarity,
} from "./motifs";
export { Aminoacids } from "./ammino";
export { computeCodonUsage } from "./metrics";
export {
  translateCodon,
  translateDnaSequence,
  retrieveProteinsFromAllDnaReadingFrames,
  retrieveProteinsFromDnaStrand,
} from "./translation";
export { throwInvalidProteinError } from "./errors";
export { assertValidProtein } from "./validation";
