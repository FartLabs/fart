import type { Schema, System } from "./system.ts";

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
      kind: "deno_deploy",
      project_name: "string",
    },
    {
      kind: "google_sheets",
      sheet_id: "string",
    },
  ],
};

console.log(system);
