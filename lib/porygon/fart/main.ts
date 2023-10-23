// GitHub repo: https://github.com/ethanthatonekid/fart-example
// File name: main.ts
// deno.jsonc: { "tasks":
// { "generate": "deno run -A https://deno.land/x/generate@0.0.2/cli/main.ts" } }

//deno:generate deno run -A cmd/generate_app/main.ts
import { makeApp } from "./app_generated.ts";

if (import.meta.main) {
  const app = makeApp();
  Deno.serve(app);
}
