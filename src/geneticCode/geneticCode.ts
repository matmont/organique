import { Aminoacids } from "../protein/ammino";

export const StopCodon = "_";

export type GeneticCode = {
  code: Record<string, Aminoacids>;
  startCodon: string;
  stopCodon: string[];
  intronRegex: RegExp;
};

export const HUMAN_GENETIC_CODE: GeneticCode = {
  code: {
    GCT: Aminoacids.Alanine,
    GCC: Aminoacids.Alanine,
    GCA: Aminoacids.Alanine,
    GCG: Aminoacids.Alanine,

    TGT: Aminoacids.Cystein,
    TGC: Aminoacids.Cystein,

    GAT: Aminoacids.AsparticAcid,
    GAC: Aminoacids.AsparticAcid,

    GAA: Aminoacids.GlutamicAcid,
    GAG: Aminoacids.GlutamicAcid,

    TTT: Aminoacids.Phenylalanine,
    TTC: Aminoacids.Phenylalanine,

    GGT: Aminoacids.Glycine,
    GGC: Aminoacids.Glycine,
    GGA: Aminoacids.Glycine,
    GGG: Aminoacids.Glycine,

    CAT: Aminoacids.Histidine,
    CAC: Aminoacids.Histidine,

    ATA: Aminoacids.Isoleucine,
    ATT: Aminoacids.Isoleucine,
    ATC: Aminoacids.Isoleucine,

    AAA: Aminoacids.Lysine,
    AAG: Aminoacids.Lysine,

    TTA: Aminoacids.Leucine,
    TTG: Aminoacids.Leucine,
    CTT: Aminoacids.Leucine,
    CTC: Aminoacids.Leucine,
    CTA: Aminoacids.Leucine,
    CTG: Aminoacids.Leucine,

    ATG: Aminoacids.Methionine,

    AAT: Aminoacids.Asparagine,
    AAC: Aminoacids.Asparagine,

    CCT: Aminoacids.Proline,
    CCC: Aminoacids.Proline,
    CCA: Aminoacids.Proline,
    CCG: Aminoacids.Proline,

    CAA: Aminoacids.Glutamine,
    CAG: Aminoacids.Glutamine,

    CGT: Aminoacids.Arginine,
    CGC: Aminoacids.Arginine,
    CGA: Aminoacids.Arginine,
    CGG: Aminoacids.Arginine,
    AGA: Aminoacids.Arginine,
    AGG: Aminoacids.Arginine,

    TCT: Aminoacids.Serine,
    TCC: Aminoacids.Serine,
    TCA: Aminoacids.Serine,
    TCG: Aminoacids.Serine,
    AGT: Aminoacids.Serine,
    AGC: Aminoacids.Serine,

    ACT: Aminoacids.Threonine,
    ACC: Aminoacids.Threonine,
    ACA: Aminoacids.Threonine,
    ACG: Aminoacids.Threonine,

    GTT: Aminoacids.Valine,
    GTC: Aminoacids.Valine,
    GTA: Aminoacids.Valine,
    GTG: Aminoacids.Valine,

    TGG: Aminoacids.Tryptophan,

    TAT: Aminoacids.Tyrosine,
    TAC: Aminoacids.Tyrosine,

    TAA: Aminoacids.StopAmino,
    TAG: Aminoacids.StopAmino,
    TGA: Aminoacids.StopAmino,
  },
  startCodon: "ATG",
  stopCodon: ["TAA", "TAG", "TGA"],
  intronRegex: /GT.{1, 10}TACTAAC.{1, 10}AC/g,
};
