import type { Component } from "./component.ts";

export const CLASS_PROPERTY_TYPE = "class_property";

export interface ClassMemberProperties {
  name: string;
  type?: string;
  default?: string;
  readonly?: boolean;
  visibility?: "public" | "private" | "protected";
  static?: boolean;
}

export type ClassMemberComponent = Component<
  typeof CLASS_PROPERTY_TYPE,
  ClassMemberProperties
>;

export function generateClassMember(component: ClassMemberComponent): string {
  return `${component.properties.static ? "static " : ""} ${
    component.properties.visibility ?? "public"
  } ${component.properties.readonly ? "readonly " : ""}${
    component.properties.name
  }${component.properties.type ? `: ${component.properties.type}` : ""}${
    component.properties.default ? ` = ${component.properties.default}` : ""
  };`;
}

export const CLASS_TYPE = "class";

export interface ClassProperties {
  name: string;
  extends?: string[];
  implements?: string[];
}

export function generateClass(component: Component): string {
  return `class ${component.properties.name}${component.children
    ?.map((child) => `  ${child}`)
    .join("\n")}\n}`;
}

export function generateTS(component: Component): string {
  switch (component.type) {
    case CLASS_TYPE: {
      return generateClass(component);
    }

    default: {
      throw new Error(`Unknown component type: ${component.type}`);
    }
  }
}
