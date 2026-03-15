import { assertEquals, assertThrows } from "@std/assert";
import { assertKind } from "./utils.ts";
import { Lexeme, Token } from "../tokenize/mod.ts";

Deno.test("assertKind successfully returns matching token", () => {
  const token = new Token("{", 1, 1); // StructOpener
  const result = assertKind(token, Lexeme.StructOpener, Lexeme.TupleOpener);
  assertEquals(result, token);
});

Deno.test("assertKind throws on undefined token", () => {
  assertThrows(
    () => assertKind(undefined, Lexeme.Identifier),
    Error,
    "Expected token kind 0, but got undefined",
  );
});

Deno.test("assertKind throws on non-matching token", () => {
  const token = new Token("{", 1, 1); // StructOpener
  assertThrows(
    () => assertKind(token, Lexeme.Identifier),
    Error,
    "Expected token kind 0, but got {",
  );
});
