// Moved to:
//

/**
 * System is a collection of components.
 */
export interface System<TSchema extends Schema> {
  components: ComponentsOf<TSchema>;
}

/**
 * ComponentsOf is a list of components from a schema.
 */
export type ComponentsOf<TSchema extends Schema> = Array<ComponentOf<TSchema>>;

/**
 * ComponentOf is a component from a schema.
 */
export type ComponentOf<TSchema extends Schema> = {
  [TKind in keyof TSchema]: Component<TSchema, TKind>;
}[keyof TSchema];

/**
 * Component is a component from a schema by kind.
 */
export type Component<
  TSchema extends Schema,
  TKind extends keyof TSchema,
> =
  & { kind: TKind }
  & {
    [TFieldName in keyof TSchema[TKind]]: FieldTypeOf<
      TSchema[TKind][TFieldName]
    >;
  };

/**
 * FieldTypeOf converts a schema field type to a TypeScript type.
 */
export type FieldTypeOf<TSchemaFieldType extends keyof FieldTypeMap> =
  FieldTypeMap[TSchemaFieldType];

/**
 * FieldTypeMap is a map of schema field types to TypeScript types.
 */
export interface FieldTypeMap {
  string: string;
  number: number;
  boolean: boolean;
  "string[]": string[];
  "number[]": number[];
  "boolean[]": boolean[];
}

/**
 * Schema is a collection of components.
 */
export type Schema = Record<string, SchemaComponent>;

/**
 * SchemaComponent is a component from a schema.
 */
export type SchemaComponent = Record<string, keyof FieldTypeMap>;
