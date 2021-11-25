import { assert, assertEquals } from "../../deps/std/testing.ts";
import {
  checkIsIdentifier,
  checkIsInlineComment,
  checkIsMultilineComment,
  checkIsTextLiteral,
  findInLexicon,
} from "./utils.ts";
import { LEXICON, Lexicon } from "./lexicon.ts";

Deno.test("finds correct index in lexicon", () => {
  const expectation = Lexicon.TypeDefiner;
  const reality = findInLexicon("type", LEXICON);
  assertEquals(expectation, reality);
});

Deno.test("returns null when not found (or null) in lexicon", () => {
  const expectation = null;
  const reality = findInLexicon("not_in_LEXICON", LEXICON);
  assertEquals(expectation, reality);
  assertEquals(expectation, findInLexicon(null, LEXICON));
});

Deno.test("correctly checks identifier", () => {
  assert(checkIsIdentifier("good"));
});

Deno.test("correctly checks identifier (inner dots are good)", () => {
  assert(checkIsIdentifier("inner.dots.are.good"));
});

Deno.test("correctly checks identifier ('_' is good)", () => {
  assert(checkIsIdentifier("_underscores_are_chill_anywhere_"));
});

Deno.test("correctly checks identifier ('$' is good)", () => {
  assert(checkIsIdentifier("$_is_good_anywhere_$_$"));
});

Deno.test("correctly checks identifier (caps are good)", () => {
  assert(checkIsIdentifier("CAPS_are_good_ANYWHERE"));
});

Deno.test("correctly checks identifier (emojis are good)", () => {
  assert(checkIsIdentifier("CAPS_are_good_ANYWHERE"));
});

Deno.test("correctly checks identifier (numbers are good)", () => {
  assert(checkIsIdentifier("nums_are_good1234567890"));
});

Deno.test("correctly checks identifier (leading numbers are bad)", () => {
  assert(!checkIsIdentifier("1leading_number_is_bad"));
});

Deno.test("correctly checks identifier (symbols are bad)", () => {
  assert(!checkIsIdentifier("symbols_are_bad_Δ"));
});

Deno.test("correctly checks identifier (some special characters are bad)", () => {
  assert(!checkIsIdentifier("bad!")); // contains '!'
  assert(!checkIsIdentifier("bad@")); // contains '@'
  assert(!checkIsIdentifier("bad#")); // contains '#'
  assert(!checkIsIdentifier("bad^")); // contains '^'
  assert(!checkIsIdentifier("bad&")); // contains '&'
  assert(!checkIsIdentifier("bad*")); // contains '*'
  assert(!checkIsIdentifier("bad|")); // contains '|'
  assert(!checkIsIdentifier("bad+")); // contains '+'
  assert(!checkIsIdentifier("bad=")); // contains '='
});

Deno.test("correctly checks identifier (outer dots are bad)", () => {
  assert(!checkIsIdentifier(".outer.dots.are.bad."));
});

Deno.test("correctly checks identifier (hyphens are bad)", () => {
  assert(!checkIsIdentifier("hyphens-are-bad"));
});

Deno.test("correctly checks text literal (with '`')", () => {
  assert(checkIsTextLiteral("`example`"));
});

Deno.test('correctly checks text literal (with "\'")', () => {
  assert(checkIsTextLiteral("'example'"));
});

Deno.test("correctly checks text literal (with '\"')", () => {
  assert(checkIsTextLiteral('"example"'));
});

Deno.test("correctly checks text literal (multiline is good)", () => {
  assert(
    checkIsTextLiteral(`"example
example
example"`),
  );
});

Deno.test("correctly checks text literal (non-matching quotes)", () => {
  assert(!checkIsTextLiteral('"example`'));
});

Deno.test("correctly checks inline comment", () => {
  assert(checkIsInlineComment("; example"));
});

Deno.test("correctly checks inline comment (not a comment)", () => {
  assert(!checkIsInlineComment("example"));
});

Deno.test("correctly checks multiline comment", () => {
  assert(checkIsMultilineComment(`/**
 * example
 */`));
});
