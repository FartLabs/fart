// import { QB64CodeTemplate } from "./qb64-code-template.ts";
// import { assertEquals } from "../../deps/std/testing.ts";

// Deno.test("openStruct: Success", () => {
//   const actual = QB64CodeTemplate.openStruct("Thing");
//   const expected = `TYPE Thing`;
//   assertEquals(actual, expected);
// });

// Deno.test("property: Success", () => {
//   const actual = QB64CodeTemplate.property("foo", false, "INTEGER");
//   const expected = `foo AS INTEGER`;
//   assertEquals(actual, expected);
// });

// Deno.test("closeStruct: Success", () => {
//   const actual = QB64CodeTemplate.closeStruct();
//   const expected = `END TYPE`;
//   assertEquals(actual, expected);
// });

// Deno.test("import: Returns null to identify as unimplemented", () => {
//   const actual = QB64CodeTemplate.import("./types", ["Thing1", "Thing2"]);
//   assertEquals(actual, null);
// });

// Deno.test("method: Returns null to identify as unimplemented", () => {
//   const actual = QB64CodeTemplate.method("ping");
//   assertEquals(actual, null);
// });
