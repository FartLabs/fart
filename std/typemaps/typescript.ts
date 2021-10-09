import { ModifierType, ReservedType, TypeMap } from "../../lib/gen/typemap.ts";

const typescript: TypeMap = {
  [ReservedType.Default]: "any",
  [ReservedType.Number]: "number",
  [ReservedType.String]: "string",
  [ReservedType.Boolean]: "boolean",

  [ModifierType.Array]: (t: string) => `Array<${t}>`, // foos: array % Foo
  [ModifierType.Async]: (t: string) => `Promise<${t}>`, // bar: async % Bar
  [ModifierType.Dictionary]: (t1: string, t2: string) => `Record<${t1}, ${t2}>`, // dex: dict % <number, Pokemon>
  [ModifierType.Function]: (t1: string, t2: string) =>
    `(input: ${t1}) => ${t2}`, // catch: func % <PokeBall, async % CatchStatus>
};

export default typescript;
