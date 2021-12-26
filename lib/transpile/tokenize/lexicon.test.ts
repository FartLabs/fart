import { assertThrows } from "../../../deps/std/testing.ts";

import { LEXICON } from "./lexicon.ts";

Deno.test("LEXICON is a frozen map", () => {
  // @ts-expect-error: set throws intentionally
  assertThrows(() => LEXICON.set("a", "b"));
  // @ts-expect-error: delete throws intentionally
  assertThrows(() => LEXICON.delete("a"));
  // @ts-expect-error: clear throws intentionally
  assertThrows(() => LEXICON.clear("a"));
});
