export const throwInvalidProteinError = () => {
  throw new Error(`❌​ The provided sequence is not a valid protein`);
};

export const throwProteinsNotSameLength = () => {
  throw new Error(`❌​ The provided proteins does not have the same length`);
};
