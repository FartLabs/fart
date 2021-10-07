import { ModifierType, ReservedType, TypeMap } from "../../lib/typemap/mod.ts";

const typescript: TypeMap = {
  [ReservedType.Default]: "any",
  [ReservedType.Number]: "number",
  [ReservedType.String]: "string",
  [ReservedType.Boolean]: "boolean",

  [ModifierType.Array]: (t) => `Array<${t}>`, // foos: array % Foo
  [ModifierType.Async]: (t) => `Promise<${t}>`, // bar: async % Bar
  [ModifierType.Dictionary]: (t1, t2) => `Record<${t1}, ${t2}>`, // dex: dict % <number, Pokemon>
  [ModifierType.Function]: (t1, t2) => `(input: ${t1}) => ${t2}`, // catch: func % <PokeBall, async % CatchStatus>
};

export default typescript;
