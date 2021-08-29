import { FartTarget } from "./types.ts";

export const typemaps = {
  [FartTarget.TypeScript]: Object.entries({
    number: "number",
    string: "string",
    boolean: "boolean",
    date: "Date",
  }).reduce((map, [alias, type]) => {
    map[alias] = type;
    map[`async_${alias}`] = `Promise<${type}>`;
    return map;
  }, {} as Record<string, string>),
  [FartTarget.Go]: {},
  [FartTarget.Basic]: {},
};
