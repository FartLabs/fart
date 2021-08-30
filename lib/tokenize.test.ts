import { tokenize } from "./tokenize.ts";
import { Lexicon } from "./types.ts";
import { assert, assertEquals } from "../devdeps/std/testing.ts";

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
    Lexicon.TypeDefiner,
    "Thing",
    Lexicon.Nester,
    "foo",
    Lexicon.Setter,
    "number",
    "bar",
    Lexicon.Setter,
    "string",
    Lexicon.Denester,
  ];
  assertEquals(actual, expected);
});

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

Deno.test("Tokenizes a Pokemon struct", () => {
  const actual = [...tokenize(`type Pokemon {
    name: string
    types: { type1: string, type2: string }
  }`)];
  const expected = [
    Lexicon.TypeDefiner,
    "Pokemon",
    Lexicon.Nester,
    "name",
    Lexicon.Setter,
    "string",
    "types",
    Lexicon.Setter,
    Lexicon.Nester,
    "type1",
    Lexicon.Setter,
    "string",
    Lexicon.Separator,
    "type2",
    Lexicon.Setter,
    "string",
    Lexicon.Denester,
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
