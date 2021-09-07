import { ReservedType } from "../constants/lexicon.ts";

export class TypeMap extends Map<string, string> {
  constructor(input?: Array<[ReservedType | string, string]>) {
    super(input);
    for (const reservedType of Object.values(ReservedType)) {
      if (!reservedType.startsWith("async") && !this.has(reservedType)) {
        throw new Error(`Expected required type ${reservedType} to be mapped`);
      }
    }
  }
}

export { ReservedType };
