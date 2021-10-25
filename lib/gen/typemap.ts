export enum ReservedType {
  Omit = "_",
  Number = "number",
  String = "string",
  Boolean = "boolean",
  Default = "any",
}

export enum ModifierType {
  Array = "array", // Modifies anything.
  Async = "async", // Modifies anything.
  Dictionary = "dict", // Modifies length-2 tuples.
  Function = "fn", // Modifies length-2 tuples.
  Date = "date", // Modifies string or number.
  URL = "url", // Modifies string.
}

/**
 * Returns a type composed into plain text (e.g. `number`,
 * `Array<string>`, `(a: number, b: number) => number`, etc.).
 */
export type TypeModifier = (...inner: string[]) => string;

/**
 * The TypeMap API is designed to delegate the generation of
 * syntax for various programming languages.
 */
export interface TypeMap {
  [ReservedType.Omit]: string;
  [ReservedType.Number]: string;
  [ReservedType.String]: string;
  [ReservedType.Boolean]: string;
  [ReservedType.Default]: string;

  // Modifiers are not required for all languages.
  [ModifierType.Array]?: TypeModifier;
  [ModifierType.Async]?: TypeModifier;
  [ModifierType.Dictionary]?: TypeModifier;
  [ModifierType.Function]?: TypeModifier;
  [ModifierType.Date]?: TypeModifier;
  [ModifierType.URL]?: TypeModifier;
}

export const OMIT_PATTERN = /^\_$/;
