import {
  ModifierType,
  OMIT_PATTERN,
  ReservedType,
  TypeMap,
} from "../../lib/gen/typemap.ts";
import { genUniqueNames } from "./common.ts";

const typescript: TypeMap = {
  [ReservedType.Omit]: "_",
  [ReservedType.Number]: "number",
  [ReservedType.String]: "string",
  [ReservedType.Boolean]: "boolean",
  [ReservedType.Default]: "any",

  [ModifierType.Array]: (t: string) => `Array<${t}>`, // foos: array % Foo
  [ModifierType.Async]: (t: string) => `Promise<${t}>`, // bar: async % Bar
  [ModifierType.Dictionary]: (t1: string, t2: string) => `Record<${t1}, ${t2}>`, // dex: dict % <number, Pokemon>
  [ModifierType.Function]: (...t: string[]) => { // catch: func % <PokeBall, async % CatchStatus>
    let result = "(";
    const gimmeName = genUniqueNames();
    while (t.length > 1) {
      const { value: name } = gimmeName.next();
      if (!name) break; // break in case of emergency
      const argType = t.shift();
      const omitted = argType !== undefined && OMIT_PATTERN.test(argType);
      if (omitted) continue;
      const secondToLast = t.length === 1;
      result += `${name}: ${argType}` +
        (secondToLast ? "" : ", ");
    }
    const returnType = t.pop()?.replace(OMIT_PATTERN, "void") ?? "void";
    return result + `) => ${returnType}`;
  },
  [ModifierType.Date]: (t: string) =>
    // created_at*: date % string
    t === "string" || t === "number" ? "Date" : t,
  [ModifierType.URL]: (t: string) => t === "string" ? "URL" : t, // avatar_url*: url % string
};

export default typescript;
