import { LanguageTarget } from "./types.ts";

export interface TypeMap {
  _: string; // Reserved for ambiguous/catch-all type.
  [type: string]: string;
}

export const TYPEMAPS: Record<LanguageTarget, TypeMap> = {
  [LanguageTarget.TypeScript]: Object.entries({
    _: "any",
    number: "number",
    string: "string",
    boolean: "boolean",
    date: "Date",
  }).reduce((map, [alias, mappedType]) => {
    map[alias] = mappedType;
    map[`async_${alias}`] = `Promise<${mappedType}>`;
    return map;
  }, {} as TypeMap),
  [LanguageTarget.Go]: {
    _: "interface{}",
    number: "float64",
    string: "string",
    boolean: "bool",
  },
  [LanguageTarget.CPP]: {
    _: "auto",
  },
  [LanguageTarget.Basic]: {
    _: "INTEGER",
    number: "DOUBLE",
    string: "STRING",
    boolean: "INTEGER",
  },
};
