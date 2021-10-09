import { assertEquals } from "../../deps/std/testing.ts";
import { CartEventName } from "../../lib/gen/cart.ts";
import DenoCart from "./deno.cart.ts";

Deno.test("Passes dependencies to import event", async () => {
  const code = await DenoCart.dispatch({
    type: CartEventName.Import,
    source: "./path/to/types.fart",
    dependencies: ["Thing1", "Thing2"],
  });
  const actual = code?.export();
  const expected = `import type { Thing1, Thing2 } from "./path/to/types.ts";`;
  assertEquals(actual, expected);
});

// Deno.test("Import handler returns null without dependencies", () => {
//   const actual = DenoCart.dispatch(CartEvent.Import, "./types", []);
//   assertEquals(actual, null);
// });

// Deno.test("Successfully handles struct open event", () => {
//   const actual = DenoCart.dispatch(CartEvent.StructOpen, "Thing");
//   const expected = `export interface Thing {`;
//   assertEquals(actual, expected);
// });

// Deno.test("Property is assumed to be optional by default", () => {
//   const actual = DenoCart.dispatch(
//     CartEvent.SetProperty,
//     "count",
//     undefined,
//     "number",
//   );
//   const expected = `count?: number;`;
//   assertEquals(actual, expected);
// });

// Deno.test("Property is required when told", () => {
//   const actual = DenoCart.dispatch(
//     CartEvent.SetProperty,
//     "count",
//     true,
//     "number",
//   );
//   const expected = `count: number;`;
//   assertEquals(actual, expected);
// });

// Deno.test("Method resolves successfully without input or output", () => {
//   const actual = DenoCart.dispatch(CartEvent.SetMethod, "ping");
//   const expected = `ping: () => void;`;
//   assertEquals(actual, expected);
// });

// Deno.test("Method resolves successfully without input", () => {
//   const actual = DenoCart.dispatch(
//     CartEvent.SetMethod,
//     "ping",
//     { output: "Pong" },
//   );
//   const expected = `ping?: () => Pong;`;
//   assertEquals(actual, expected);
// });

// Deno.test("Method resolves successfully without output", () => {
//   const actual = DenoCart.dispatch(
//     CartEvent.SetMethod,
//     "ping",
//     { input: "Ping" },
//   );
//   const expected = `ping?: (input: Ping) => void;`;
//   assertEquals(actual, expected);
// });

// Deno.test("Method resolves successfully with input and output", () => {
//   const actual = DenoCart.dispatch(CartEvent.SetMethod, "ping", {
//     input: "Ping",
//     output: "Pong",
//     required: true,
//   });
//   const expected = `ping: (input: Ping) => Pong;`;
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully handles struct close event", () => {
//   const actual = DenoCart.dispatch(CartEvent.StructClose);
//   assertEquals(actual, `}`);
// });
