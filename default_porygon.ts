// import * as porygon from "./porygon.ts";

interface System<TSchema extends Schema> {
  components: ({
    [TName in keyof TSchema]: {
      type: TName;
      fields: {
        [TFieldName in keyof TSchema[TName]]: FieldTypeOf<
          TSchema[TName][TFieldName]
        >;
      };
    };
  }[keyof TSchema])[];
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
      type: "deno_deploy",
      fields: {
        project_name: "string",
      },
    },
    {
      type: "google_sheets",
      fields: {
        "sheet_id": "string",
      },
    },
  ],
};

console.log({ system });
