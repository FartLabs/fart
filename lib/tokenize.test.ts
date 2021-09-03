import { tokenize, Token, T } from "./tokenize.ts";
import { Lexicon, LEXICON } from "./constants/lexicon.ts";
import { assert, assertEquals } from "../deps/std/testing.ts";

const assertTokensEqual = (actual: Generator<Token, Token>, expected: Token[]) =>
  assertEquals([...actual], expected);

Deno.test("Empty input results in empty output", () => {
  const { done } = tokenize("").next();
  assert(done);
});

Deno.test("Successfully tokenizes given syntax", () => {
  const actual = [...tokenize(`type Thing {
  foo: number
  bar: string
}`)];
  const expected = [
    T.type_definer(1, 1),
    T.id("Thing", 1, 6),
    T.nester(1, 12),
    T.id("foo", 2, 3),
    T.setter(2, 6),
    T.id("number", 2, 8),
    T.id("bar", 2, 3),
    T.setter(2, 6),
    T.id("string", 2, 8),
    T.denester(4, 1),
  ];
  assertEquals(actual, expected);
});

/*
Deno.test("Omits comments from results", () => {
  const actual = [...tokenize(`type Thing {
    foo: number; This is a comment
  }`)];
  const expected = [
    Lexicon.TypeDefiner,
    "Thing",
    Lexicon.Nester,
    "foo",
    Lexicon.Setter,
    "number",
    Lexicon.Denester,
  ];
  assertEquals(actual, expected);
});

Deno.test("Omits valid code comments from results", () => {
  const actual = [...tokenize(`type Thing {
    foo: number; bar: string
  }`)];
  const expected = [
    Lexicon.TypeDefiner,
    "Thing",
    Lexicon.Nester,
    "foo",
    Lexicon.Setter,
    "number",
    Lexicon.Denester,
  ];
  assertEquals(actual, expected);
});

Deno.test("Tokenizes a string literal", () => {
  const actual = [...tokenize(`impo \`./path/to/types\` {
    Thing1, Thing2
  }`)];
  const expected = [
    Lexicon.ImpoDefiner,
    "\`./path/to/types\`",
    Lexicon.Nester,
    "Thing1",
    Lexicon.Separator,
    "Thing2",
    Lexicon.Denester,
  ];
  assertEquals(actual, expected);
});

Deno.test("Tokenizes Pokemon-themed structs", () => {
  const actual = [...tokenize(`type Pokeball {
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
  }`)];
  const expected = [
    Lexicon.TypeDefiner,
    "Pokeball",
    Lexicon.Nester,
    "id",
    Lexicon.RequiredMarker + Lexicon.Setter,
    "string",
    "used",
    Lexicon.RequiredMarker + Lexicon.Setter,
    "boolean",
    "catch",
    Lexicon.RequiredMarker + Lexicon.Setter,
    Lexicon.OpeningAngle,
    "string",
    Lexicon.Separator,
    "boolean",
    Lexicon.ClosingAngle,
    Lexicon.Denester,

    Lexicon.TypeDefiner,
    "Pokemon",
    Lexicon.Nester,
    "name",
    Lexicon.RequiredMarker + Lexicon.Setter,
    "string",
    "ball",
    Lexicon.Setter,
    "Pokeball",
    "types",
    Lexicon.RequiredMarker + Lexicon.Setter,
    Lexicon.Nester,
    "type1",
    Lexicon.RequiredMarker + Lexicon.Setter,
    "string",
    "type2",
    Lexicon.Setter,
    "string",
    Lexicon.Denester,
    "obtain",
    Lexicon.RequiredMarker + Lexicon.Setter,
    Lexicon.OpeningAngle,
    "Pokeball",
    Lexicon.ClosingAngle,
    Lexicon.Denester,
  ];
  assertEquals(actual, expected);
});

Deno.test("Tokenizes a required setter", () => {
  const actual = [...tokenize(`type Thing {
    foobar*: number
  }`)];
  const expected = [
    Lexicon.TypeDefiner,
    "Thing",
    Lexicon.Nester,
    "foobar",
    Lexicon.RequiredMarker + Lexicon.Setter,
    "number",
    Lexicon.Denester,
  ];
  assertEquals(actual, expected);
});

Deno.test("Tokenizes a method definition", () => {
  const actual = [...tokenize(`type Thing {
    getSomething: <ThingInput, ThingOutput>
  }`)];
  const expected = [
    Lexicon.TypeDefiner,
    "Thing",
    Lexicon.Nester,
    "getSomething",
    Lexicon.Setter,
    Lexicon.OpeningAngle,
    "ThingInput",
    Lexicon.Separator,
    "ThingOutput",
    Lexicon.ClosingAngle,
    Lexicon.Denester,
  ];
  assertEquals(actual, expected);
});
*/