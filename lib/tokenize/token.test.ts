// TODO(@ethandavidson): test `is` method
// TODO(@ethandavidson): test `getKindOf` method
// TODO(@ethandavidson): test `toString` method
// TODO(@ethandavidson): test `value` method

import { assertEquals } from "../../deps/std/testing.ts";
import { Token } from "./token.ts";
import { Lexicon } from "./lexicon.ts";

Deno.test("creates a token with an empty string without crashing", () => {
  assertEquals(new Token("").kind, Lexicon.Unknown);
});
