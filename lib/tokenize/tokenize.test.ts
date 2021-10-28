import { Token } from "./token.ts";
import { tokenize } from "./tokenize.ts";
import { T } from "./alias.ts";
import { assert, assertEquals } from "../../deps/std/testing.ts";
import { Lexicon } from "../consts/lexicon.ts";

const assertTokensEqual = (
  actual: Generator<Token, Token>,
  expected: Token[],
) => assertEquals([...actual], expected);

Deno.test("Successfully creates identifier token", () => {
  const {
    kind: actualKind,
    value: actualValue,
  } = new Token("abc123ABC", 0, 0);
  const expectedKind = Lexicon.Identifier;
  const expectedValue = "abc123ABC";
  assertEquals(actualKind, expectedKind);
  assertEquals(actualValue, expectedValue);
});

Deno.test("Successfully creates string literal token", () => {
  const { kind: actualKind, value: actualValue } = new Token("\`abc\`", 0, 0);
  const expectedKind = Lexicon.StringLiteral;
  const expectedValue = "abc";
  assertEquals(actualKind, expectedKind);
  assertEquals(actualValue, expectedValue);
});

Deno.test("An empty raw value has a kind of EOF", () => {
  const { kind: actualKind } = new Token("", 0, 0);
  const expectedKind = Lexicon.EOF;
  assertEquals(actualKind, expectedKind);
});

Deno.test("Empty input results in empty output", () => {
  const { done } = tokenize("").next();
  assert(done);
});

Deno.test("Successfully tokenizes given syntax", () => {
  const actual = tokenize(`type Thing {
  foo: number
  bar: string
}`);
  const expected = [
    T.type_definer(1, 1),
    T.id("Thing", 1, 6),
    T.nester(1, 12),
    T.id("foo", 2, 3),
    T.setter(2, 6),
    T.id("number", 2, 8),
    T.id("bar", 3, 3),
    T.setter(3, 6),
    T.id("string", 3, 8),
    T.denester(4, 1),
  ];
  assertTokensEqual(actual, expected);
});

Deno.test("Successfully tokenizes nested syntax", () => {
  const actual = tokenize(`type Thing {
  abc: {
    def: {
      ghi: number
    }
  }
}`);
  const expected = [
    T.type_definer(1, 1),
    T.id("Thing", 1, 6),
    T.nester(1, 12),
    T.id("abc", 2, 3),
    T.setter(2, 6),
    T.nester(2, 8),
    T.id("def", 3, 5),
    T.setter(3, 8),
    T.nester(3, 10),
    T.id("ghi", 4, 7),
    T.setter(4, 10),
    T.id("number", 4, 12),
    T.denester(5, 5),
    T.denester(6, 3),
    T.denester(7, 1),
  ];
  assertTokensEqual(actual, expected);
});

Deno.test("Omits comments from results when asked", () => {
  const actual = tokenize(
    `type Thing {
  foo: number; This is a comment
}`,
    /*omitComments=*/ true,
  );
  const expected = [
    T.type_definer(1, 1),
    T.id("Thing", 1, 6),
    T.nester(1, 12),
    T.id("foo", 2, 3),
    T.setter(2, 6),
    T.id("number", 2, 8),
    T.denester(3, 1),
  ];
  assertTokensEqual(actual, expected);
});

Deno.test("Omits valid code comments from results", () => {
  const actual = [...tokenize(
    `type Thing {
  foo: number; bar: string
}`,
    /*omitComments=*/ true,
  )];
  const expected = [
    T.type_definer(1, 1),
    T.id("Thing", 1, 6),
    T.nester(1, 12),
    T.id("foo", 2, 3),
    T.setter(2, 6),
    T.id("number", 2, 8),
    T.denester(3, 1),
  ];
  assertEquals(actual, expected);
});

Deno.test("Reflects comments by default", () => {
  const actual = tokenize(`type Thing {
  foo: number; This is a comment
}`);
  const expected = [
    T.type_definer(1, 1),
    T.id("Thing", 1, 6),
    T.nester(1, 12),
    T.id("foo", 2, 3),
    T.setter(2, 6),
    T.id("number", 2, 8),
    T.comment("This is a comment", 2, 14),
    T.denester(3, 1),
  ];
  assertTokensEqual(actual, expected);
});

Deno.test("Tokenizes a string literal", () => {
  const actual = tokenize(`load './path/to/types' {
  Thing1, Thing2
}`);
  const expected = [
    T.load_definer(1, 1),
    T.string_literal("'./path/to/types'", 1, 5),
    T.nester(1, 24),
    T.id("Thing1", 2, 3),
    T.separator(2, 9),
    T.id("Thing2", 2, 11),
    T.denester(3, 1),
  ];
  assertTokensEqual(actual, expected);
});

Deno.test("Tokenizes a required setter", () => {
  const actual = tokenize(`type Thing {
  foobar*: number
}`);
  const expected = [
    T.type_definer(1, 1),
    T.id("Thing", 1, 6),
    T.nester(1, 12),
    T.id("foobar", 2, 3),
    T.required_setter(2, 9),
    T.id("number", 2, 12),
    T.denester(3, 1),
  ];
  assertTokensEqual(actual, expected);
});

Deno.test("Tokenizes a method definition", () => {
  const actual = tokenize(`type Thing {
  getSomething: <ThingInput, ThingOutput>
}`);
  const expected = [
    T.type_definer(1, 1),
    T.id("Thing", 1, 6),
    T.nester(1, 12),
    T.id("getSomething", 2, 3),
    T.setter(2, 15),
    T.opening_angle(2, 17),
    T.id("ThingInput", 2, 18),
    T.separator(2, 28),
    T.id("ThingOutput", 2, 30),
    T.closing_angle(2, 41),
    T.denester(3, 1),
  ];
  assertTokensEqual(actual, expected);
});

Deno.test("Tokenizes Pokemon-themed structs", () => {
  const actual = tokenize(`type Pokeball {
  id*: string
  used*: boolean
  
  catch*: <string, boolean>
}

type Pokemon {
  name*: string
  ball: Pokeball
  types*: { type1*: string
            type2:  string }
  
  obtain*: <Pokeball>
}`);
  const expected = [
    T.type_definer(1, 1),
    T.id("Pokeball", 1, 6),
    T.nester(1, 15),
    T.id("id", 2, 3),
    T.required_setter(2, 5),
    T.id("string", 2, 8),
    T.id("used", 3, 3),
    T.required_setter(3, 7),
    T.id("boolean", 3, 10),
    T.id("catch", 5, 3),
    T.required_setter(5, 8),
    T.opening_angle(5, 11),
    T.id("string", 5, 12),
    T.separator(5, 18),
    T.id("boolean", 5, 20),
    T.closing_angle(5, 27),
    T.denester(6, 1),
    T.type_definer(8, 1),
    T.id("Pokemon", 8, 6),
    T.nester(8, 14),
    T.id("name", 9, 3),
    T.required_setter(9, 7),
    T.id("string", 9, 10),
    T.id("ball", 10, 3),
    T.setter(10, 7),
    T.id("Pokeball", 10, 9),
    T.id("types", 11, 3),
    T.required_setter(11, 8),
    T.nester(11, 11),
    T.id("type1", 11, 13),
    T.required_setter(11, 18),
    T.id("string", 11, 21),
    T.id("type2", 12, 13),
    T.setter(12, 18),
    T.id("string", 12, 21),
    T.denester(12, 28),
    T.id("obtain", 14, 3),
    T.required_setter(14, 9),
    T.opening_angle(14, 12),
    T.id("Pokeball", 14, 13),
    T.closing_angle(14, 21),
    T.denester(15, 1),
  ];
  assertTokensEqual(actual, expected);
});

Deno.test("Tokenizes a modified definition", () => {
  const actual = tokenize(`type Thing {
  getSomething: fn % <ThingInput, ThingOutput>
}`);
  const expected = [
    T.type_definer(1, 1),
    T.id("Thing", 1, 6),
    T.nester(1, 12),
    T.id("getSomething", 2, 3),
    T.setter(2, 15),
    T.id("fn", 2, 17),
    T.modifier(2, 20),
    T.opening_angle(2, 22),
    T.id("ThingInput", 2, 23),
    T.separator(2, 33),
    T.id("ThingOutput", 2, 35),
    T.closing_angle(2, 46),
    T.denester(3, 1),
  ];
  assertTokensEqual(actual, expected);
});
