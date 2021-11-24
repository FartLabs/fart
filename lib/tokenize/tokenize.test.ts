import { T } from "./t.ts";
import { Token } from "./token.ts";
import { tokenize } from "./tokenize.ts";
import { assertEquals } from "../../deps/std/testing.ts";
// import { LEXICON, Lexicon } from "./lexicon.ts";

Deno.test("yields no tokens given an empty string", () => {
  const input = "";
  const expectation: Token[] = [];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("yields a single token `type`", () => {
  const input = "type";
  const expectation = [T.type(1, 1)];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("yields a full `type` definition", () => {
  const input = `type Example {
  testProperty: string
}`;
  const expectation = [
    T.type(1, 1),
    T.id("Example", 1, 6),
    T.nest(1, 14),
    T.id("testProperty", 2, 3),
    T.setter_1(2, 15),
    T.id("string", 2, 17),
    T.denest(3, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});
