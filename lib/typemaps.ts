import { FartTarget } from "./types.ts";

export const typemaps = {
  [FartTarget.TypeScript]: {
    number: "number",
    string: "string",
    boolean: "boolean",
    Date: "Date",
  },
  [FartTarget.Go]: {},
  [FartTarget.Basic]: {},
};
