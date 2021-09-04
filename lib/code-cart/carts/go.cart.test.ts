// import { GoCodeTemplate } from "./go-code-template.ts";
// import { assertEquals } from "../../deps/std/testing.ts";

// Deno.test("openStruct: Success", () => {
//   const actual = GoCodeTemplate.openStruct("Thing");
//   const expected = `type Thing interface {`;
//   assertEquals(actual, expected);
// });

// Deno.test("property: Success", () => {
//   const actual = GoCodeTemplate.property("foo", false, "float64");
//   const expected = `foo() float64`;
//   assertEquals(actual, expected);
// });

// Deno.test("closeStruct: Success", () => {
//   const actual = GoCodeTemplate.closeStruct();
//   const expected = `}`;
//   assertEquals(actual, expected);
// });

// Deno.test("import: Success", () => {
//   const actual = GoCodeTemplate.import("github.com/types/date", []);
//   assertEquals(actual, `import "github.com/types/date"`);
// });

// Deno.test("method: Resolves successfully without input or output", () => {
//   const actual = GoCodeTemplate.method("ping");
//   const expected = `ping()`;
//   assertEquals(actual, expected);
// });

// Deno.test("method: Resolves successfully without input", () => {
//   const actual = GoCodeTemplate.method("ping", { output: "Pong" });
//   const expected = `ping() (Pong)`;
//   assertEquals(actual, expected);
// });

// Deno.test("method: Resolves successfully without output", () => {
//   const actual = GoCodeTemplate.method("ping", { input: "Ping" });
//   const expected = `ping(p Ping)`;
//   assertEquals(actual, expected);
// });

// Deno.test("method: Resolves successfully", () => {
//   const actual = GoCodeTemplate.method("ping", {
//     input: "Ping",
//     output: "Pong",
//   });
//   const expected = `ping(p Ping) (Pong)`;
//   assertEquals(actual, expected);
// });
