import { ReservedType, TypeMap } from "../../lib/gen/typemap.ts";

const fake: TypeMap = {
  [ReservedType.Default]: "any",
  [ReservedType.Number]: "num",
  [ReservedType.String]: "str",
  [ReservedType.Boolean]: "boo",
};

export default fake;
