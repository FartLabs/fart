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
  Function = "func", // Modifies length-2 tuples.
}

export type TypeModifer = (...inner: string[]) => string;

export interface TypeMap {
  [ReservedType.Default]: string;
  [ReservedType.Number]: string;
  [ReservedType.String]: string;
  [ReservedType.Boolean]: string;

  // Modifiers are not required for all languages.
  [ModifierType.Array]?: TypeModifer;
  [ModifierType.Async]?: TypeModifer;
  [ModifierType.Dictionary]?: TypeModifer;
  [ModifierType.Function]?: TypeModifer;
}
