// import * as porygon from "./porygon.ts";

interface System<TSchema extends Schema> {
  components: Component<TSchema[keyof TSchema]>[];
}

interface Component<TSchemaComponent extends SchemaComponent> {
  name: TSchemaComponent["name"];
  fields: {
    [TName in keyof TSchemaComponent]: FieldTypeOf<TSchemaComponent[TName]>;
  };
}

type FieldTypeOf<TSchemaFieldType extends SchemaFieldType> =
  TSchemaFieldType extends "string" ? string
    : TSchemaFieldType extends "number" ? number
    : TSchemaFieldType extends "boolean" ? boolean
    : never;

type Schema = Record<string, SchemaComponent>;

type SchemaComponent = Record<string, SchemaFieldType>;

type SchemaFieldType = "string" | "number" | "boolean";

const SCHEMA = {
  deno_deploy: {
    project_name: "string",
  },
  google_sheets: {
    sheet_id: "string",
  },
} as const satisfies Schema;

const system: System<typeof SCHEMA> = {
  components: [
    {
      name: "deno_deploy",
      fields: {
        project_name: "string",
        sheet_id: "string", // this is a bug, name "deno_deploy" only has "project_name" field but typescript doesn't catch it.
      },
    },
  ],
};

console.log({ system });
