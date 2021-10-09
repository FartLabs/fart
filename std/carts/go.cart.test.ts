// import { assertEquals } from "../../deps/std/testing.ts";
// import { CartEvent } from "../../lib/gen/cart.ts";
// import GoCart from "./go.cart.ts";

// Deno.test("Successfully resolves struct open event", () => {
//   const actual = GoCart.dispatch(CartEvent.StructOpen, "Thing");
//   const expected = `type Thing interface {`;
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully resolves set property event", () => {
//   const actual = GoCart.dispatch(
//     CartEvent.SetProperty,
//     "foo",
//     false,
//     "float64",
//   );
//   const expected = `foo float64`;
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully resolves struct close event", () => {
//   const actual = GoCart.dispatch(CartEvent.StructClose);
//   const expected = `}`;
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully resolves import event", () => {
//   const actual = GoCart.dispatch(
//     CartEvent.Import,
//     "whatever.com/types/date",
//     [],
//   );
//   assertEquals(actual, `import "whatever.com/types/date"`);
// });

// Deno.test("Successfully resolves set method event without input or output", () => {
//   const actual = GoCart.dispatch(CartEvent.SetMethod, "ping");
//   const expected = `ping()`;
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully resolves set method event without input", () => {
//   const actual = GoCart.dispatch(CartEvent.SetMethod, "ping", {
//     output: "Pong",
//   });
//   const expected = `ping() (Pong)`;
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully resolves set method event without output", () => {
//   const actual = GoCart.dispatch(CartEvent.SetMethod, "ping", {
//     input: "Ping",
//   });
//   const expected = `ping(p Ping)`;
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully resolves full set method event", () => {
//   const actual = GoCart.dispatch(CartEvent.SetMethod, "ping", {
//     input: "Ping",
//     output: "Pong",
//   });
//   const expected = `ping(p Ping) (Pong)`;
//   assertEquals(actual, expected);
// });
