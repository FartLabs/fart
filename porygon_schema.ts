/**
 * System is a system.
 */
export interface System<TSchema> {
  /**
   * components is a list of components.
   */
  components: Component<TSchema extends Schema, string>[];
}

/**
 * Component is a component of the system.
 */
export interface Component<TSchema extends Schema, TName extends string> {
  /**
   * name is the name of the component.
   */
  name: TName;

  /**
   * fields is a record of configuration attributes.
   */
  fields: Field<TSchema[TName]][];
}



/**
 * Schema is a schema.
 */
export type Schema = Record<string, SchemaField>;

/**
 * SchemaField is the descriptor of a component field.
 */
export interface SchemaField {
    /**
     * name is the name of the field.
     */
    name: string;
  
    /**
     * type is the type of the field.
     */
    type: "string" | "number" | "boolean";
  }