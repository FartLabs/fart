import { DenoTypeScriptCodeTemplate } from "./deno-typescript-code-template.ts";
import { assertEquals } from "../../deps/std/testing.ts";

Deno.test("import: Passes dependencies", () => {
  const actual = DenoTypeScriptCodeTemplate.import("./types", [
    "Thing1",
    "Thing2",
  ]);
  const expected = `import type { Thing1, Thing2 } from "./types.ts";`;
  assertEquals(actual, expected);
});

Deno.test("import: Returns null without details", () => {
  const actual = DenoTypeScriptCodeTemplate.import("./types", []);
  assertEquals(actual, null);
});

Deno.test("openStruct: Success", () => {
  const actual = DenoTypeScriptCodeTemplate.openStruct("Thing");
  const expected = `export interface Thing {`;
  assertEquals(actual, expected);
});

Deno.test("property: Optional by default", () => {
  const actual = DenoTypeScriptCodeTemplate.property(
    "count",
    undefined,
    "number",
  );
  const expected = `count?: number;`;
  assertEquals(actual, expected);
});

Deno.test("property: Required when told", () => {
  const actual = DenoTypeScriptCodeTemplate.property("count", true, "number");
  const expected = `count: number;`;
  assertEquals(actual, expected);
});

Deno.test("method: Resolves successfully without input or output", () => {
  const actual = DenoTypeScriptCodeTemplate.method("ping");
  const expected = `ping: () => void;`;
  assertEquals(actual, expected);
});

Deno.test("method: Resolves successfully without input", () => {
  const actual = DenoTypeScriptCodeTemplate.method("ping", { output: "Pong" });
  const expected = `ping?: () => Pong;`;
  assertEquals(actual, expected);
});

Deno.test("method: Resolves successfully without output", () => {
  const actual = DenoTypeScriptCodeTemplate.method("ping", { input: "Ping" });
  const expected = `ping?: (input: Ping) => void;`;
  assertEquals(actual, expected);
});

Deno.test("method: Resolves successfully with input and output", () => {
  const actual = DenoTypeScriptCodeTemplate.method("ping", {
    input: "Ping",
    output: "Pong",
    required: true,
  });
  const expected = `ping: (input: Ping) => Pong;`;
  assertEquals(actual, expected);
});

Deno.test("closeStruct: Success", () => {
  const actual = DenoTypeScriptCodeTemplate.closeStruct();
  assertEquals(actual, `}`);
});
