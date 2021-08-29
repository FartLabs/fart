import { tokenize } from "./tokenize.ts";
import { Lexicon } from "./types.ts";
import { assertEquals } from "../devdeps/std/testing.ts";

Deno.test("Empty input results in empty output", () => {
  const actual = [...tokenize("")];
  assertEquals(actual, []);
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
