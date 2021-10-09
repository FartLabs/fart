export enum ReservedType {
  Default = "any",
  Number = "number",
  String = "string",
  Boolean = "boolean",
}

export enum ModifierType {
  Array = "array", // Modifies anything.
  Async = "async", // Modifies anything.
  Dictionary = "dict", // Modifies length-2 tuples.
  Function = "fn", // Modifies length-2 tuples.
}

export type TypeModifier = (...inner: string[]) => string;

export interface TypeMap {
  [ReservedType.Default]: string;
  [ReservedType.Number]: string;
  [ReservedType.String]: string;
  [ReservedType.Boolean]: string;

  // Modifiers are not required for all languages.
  [ModifierType.Array]?: TypeModifier;
  [ModifierType.Async]?: TypeModifier;
  [ModifierType.Dictionary]?: TypeModifier;
  [ModifierType.Function]?: TypeModifier; // TODO: All tokens in tuple are arguments; last token in tuple is return type.
}
