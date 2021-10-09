export const odds = (chance: number) => Math.random() > (1 - chance);

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
