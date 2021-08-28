import { tokenize } from "./tokenize.ts";
import { FartGrammar } from "./types.ts";
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
    FartGrammar.TypeDefiner,
    "Thing",
    FartGrammar.Nester,
    "foo",
    FartGrammar.Setter,
    "number",
    "bar",
    FartGrammar.Setter,
    "string",
    FartGrammar.Denester,
  ];
  assertEquals(actual, expected);
});

Deno.test("Omits comments from results", () => {
  const actual = [...tokenize(`type Thing {
    foo: number; This is a comment
  }`)];
  const expected = [
    FartGrammar.TypeDefiner,
    "Thing",
    FartGrammar.Nester,
    "foo",
    FartGrammar.Setter,
    "number",
    FartGrammar.Denester,
  ];
  assertEquals(actual, expected);
});
