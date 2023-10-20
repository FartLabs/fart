/**
 * System is a system.
 */
export interface System {
  /**
   * components is a list of components.
   */
  components: Component[];
}

/**
 * Component is a component of the system.
 */
export interface Component {
  /**
   * name is the name of the component.
   */
  name: string;

  /**
   * fields is a record of configuration attributes.
   */
  fields: Field[];
}

/**
 * Field is a field of the component.
 */
export interface Field {
  /**
   * name is the name of the field.
   */
  name: string;

  /**
   * type is the type of the field.
   */
  type: "string" | "number" | "boolean";
}
