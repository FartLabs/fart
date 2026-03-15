import { assertThrows } from "@std/assert";

import { LEXEME } from "./lexeme.ts";

Deno.test("LEXEME is a frozen map", () => {
  // @ts-expect-error: set throws intentionally
  assertThrows(() => LEXEME.set("a", "b"));
  // @ts-expect-error: delete throws intentionally
  assertThrows(() => LEXEME.delete("a"));
  // @ts-expect-error: clear throws intentionally
  assertThrows(() => LEXEME.clear("a"));
});
