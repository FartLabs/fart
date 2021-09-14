import { ReservedType } from "../constants/lexicon.ts";

export enum ModifierMode {
  Prefix,
  Suffix,
}

export interface Modifier {
  alias: string;
  mode: ModifierMode;
  modify: (t: string) => string;
}

export class TypeMap extends Map<string, string> {
  constructor(
    input?: Array<[ReservedType | string, string]>,
    private modifiers: Array<Modifier | undefined> = [],
  ) {
    super(input);
    for (const reservedType of Object.values(ReservedType)) {
      if (!this.has(reservedType)) {
        throw new Error(`Expected required type ${reservedType} to be mapped`);
      }
    }
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  get(key: string): string | undefined {
    if (super.has(key)) return super.get(key);
    for (const modifier of this.modifiers) {
      if (modifier === undefined) continue;
      const modifiedKey = TypeMap.modifyKey(key, modifier);
      const mappedType = super.get(modifiedKey);
      if (mappedType !== undefined) {
        return modifier.modify(mappedType);
      }
    }
    return undefined;
  }

  addModifier(
    alias: string,
    modify: (t: string) => string,
    mode: ModifierMode = ModifierMode.Prefix,
  ): number {
    this.modifiers.push({ alias, mode, modify });
    return this.modifiers.length - 1;
  }

  removeModifier(modifierId: number) {
    delete this.modifiers[modifierId];
  }

  static modifyKey(key: string, modifier: Modifier): string {
    switch (modifier.mode) {
      case ModifierMode.Suffix: {
        if (key.endsWith(modifier.alias)) {
          return key.slice(0, key.length - modifier.alias.length);
        }
        break;
      }
      case ModifierMode.Prefix:
      default: {
        if (key.startsWith(modifier.alias)) {
          return key.slice(modifier.alias.length);
        }
        break;
      }
    }
    return key;
  }
}

export { ReservedType };
