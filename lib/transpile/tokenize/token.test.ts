import { assert, assertEquals } from "@std/assert";
import { Token } from "./token.ts";
import { Lexeme } from "./lexeme.ts";

Deno.test("creates a token with an empty string without crashing", () => {
  assertEquals(new Token("").kind, Lexeme.Unknown);
});

Deno.test("tokens can be accurately classified", () => {
  assert(new Token("").is(Lexeme.Unknown));
});

Deno.test("raw strings can be accurately classified as a kind of token", () => {
  assertEquals(Token.getKindOf(""), Lexeme.Unknown);
});

Deno.test("inherits the value of a token from its raw value", () => {
  assertEquals(new Token("type").value, "type");
});

Deno.test("tokens are stringified based on their computed value property", () => {
  assertEquals(new Token("type").toString(), "type");
});
