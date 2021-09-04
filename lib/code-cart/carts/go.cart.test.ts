import { assertEquals } from "../../../deps/std/testing.ts";
import { CodeCartEvent } from "../mod.ts";
import GoCart from "./go.cart.ts";

Deno.test("Successfully resolves struct open event", () => {
  const actual = GoCart.dispatch(CodeCartEvent.StructOpen, "Thing");
  const expected = `type Thing interface {`;
  assertEquals(actual, expected);
});

Deno.test("Successfully resolves set property event", () => {
  const actual = GoCart.dispatch(
    CodeCartEvent.SetProperty,
    "foo",
    false,
    "float64",
  );
  const expected = `foo float64`;
  assertEquals(actual, expected);
});

Deno.test("Successfully resolves struct close event", () => {
  const actual = GoCart.dispatch(CodeCartEvent.StructClose);
  const expected = `}`;
  assertEquals(actual, expected);
});

Deno.test("Successfully resolves import event", () => {
  const actual = GoCart.dispatch(
    CodeCartEvent.Import,
    "github.com/types/date",
    [],
  );
  assertEquals(actual, `import "github.com/types/date"`);
});

Deno.test("Successfully resolves set method event without input or output", () => {
  const actual = GoCart.dispatch(CodeCartEvent.SetMethod, "ping");
  const expected = `ping()`;
  assertEquals(actual, expected);
});

Deno.test("Successfully resolves set method event without input", () => {
  const actual = GoCart.dispatch(CodeCartEvent.SetMethod, "ping", {
    output: "Pong",
  });
  const expected = `ping() (Pong)`;
  assertEquals(actual, expected);
});

Deno.test("Successfully resolves set method event without output", () => {
  const actual = GoCart.dispatch(CodeCartEvent.SetMethod, "ping", {
    input: "Ping",
  });
  const expected = `ping(p Ping)`;
  assertEquals(actual, expected);
});

Deno.test("Successfully resolves full set method event", () => {
  const actual = GoCart.dispatch(CodeCartEvent.SetMethod, "ping", {
    input: "Ping",
    output: "Pong",
  });
  const expected = `ping(p Ping) (Pong)`;
  assertEquals(actual, expected);
});
