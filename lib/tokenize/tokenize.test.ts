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

Deno.test("yields a `type` definition (one property)", () => {
  const input = `type Example {
  property: string
}`;
  const expectation = [
    T.type(1, 1),
    T.id("Example", 1, 6),
    T.nest(1, 14),
    T.id("property", 2, 3),
    T.setter_1(2, 11),
    T.id("string", 2, 13),
    T.denest(3, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("yields a `type` definition (multiple properties)", () => {
  const input = `type Example {
  property1: string
  property2: number
  property3: boolean
}`;
  const expectation = [
    T.type(1, 1),
    T.id("Example", 1, 6),
    T.nest(1, 14),
    T.id("property1", 2, 3),
    T.setter_1(2, 12),
    T.id("string", 2, 14),
    T.id("property2", 3, 3),
    T.setter_1(3, 12),
    T.id("number", 3, 14),
    T.id("property3", 4, 3),
    T.setter_1(4, 12),
    T.id("boolean", 4, 14),
    T.denest(5, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("yields a `type` definition (with optional setter)", () => {
  const input = `type Example {
  optionalProperty?: string
}`;
  const expectation = [
    T.type(1, 1),
    T.id("Example", 1, 6),
    T.nest(1, 14),
    T.id("optionalProperty", 2, 3),
    T.setter_2(2, 19),
    T.id("string", 2, 22),
    T.denest(3, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("yields a `type` definition (with array modifier)", () => {
  const input = `type Example {
  property: array % boolean
}`;
  const expectation = [
    T.type(1, 1),
    T.id("Example", 1, 6),
    T.nest(1, 14),
    T.id("property", 2, 3),
    T.setter_1(2, 11),
    T.id("array", 2, 13),
    T.mod(2, 19),
    T.id("boolean", 2, 21),
    T.denest(3, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("yields a `type` definition (with array modifier and tuple)", () => {
  const input = `type Example {
  property: array % (boolean)
}`;
  const expectation = [
    T.type(1, 1),
    T.id("Example", 1, 6),
    T.nest(1, 14),
    T.id("property", 2, 3),
    T.setter_1(2, 11),
    T.id("array", 2, 13),
    T.mod(2, 19),
    T.open_tuple(2, 21),
    T.id("boolean", 2, 22),
    T.close_tuple(2, 29),
    T.denest(3, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("yields a method expecting an unnamed boolean and returning void", () => {
  const input = `type Example {
  method: fn % (boolean)
}`;
  const expectation = [
    T.type(1, 1),
    T.id("Example", 1, 6),
    T.nest(1, 14),
    T.id("method", 2, 3),
    T.setter_1(2, 9),
    T.id("fn", 2, 11),
    T.mod(2, 14),
    T.open_tuple(2, 16),
    T.id("boolean", 2, 17),
    T.close_tuple(2, 24),
    T.denest(3, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("`spec` can be used as an alias for keyword `type`", () => {
  const input = `spec Example {
  method: fn % (boolean)
}`;
  const expectation = [
    T.spec(1, 1),
    T.id("Example", 1, 6),
    T.nest(1, 14),
    T.id("method", 2, 3),
    T.setter_1(2, 9),
    T.id("fn", 2, 11),
    T.mod(2, 14),
    T.open_tuple(2, 16),
    T.id("boolean", 2, 17),
    T.close_tuple(2, 24),
    T.denest(3, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("yields a method expecting a named input and returning a boolean", () => {
  const input = `spec Example {
  method: fn % (input: string, boolean)
}`;
  const expectation = [
    T.spec(1, 1),
    T.id("Example", 1, 6),
    T.nest(1, 14),
    T.id("method", 2, 3),
    T.setter_1(2, 9),
    T.id("fn", 2, 11),
    T.mod(2, 14),
    T.open_tuple(2, 16),
    T.id("input", 2, 17),
    T.setter_1(2, 22),
    T.id("string", 2, 24),
    T.separator(2, 30),
    T.id("boolean", 2, 32),
    T.close_tuple(2, 39),
    T.denest(3, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("yields each comment as a special token", () => {
  const input = `; this comment is above \`Example\`
spec Example {
  ; this comment is above \`method\`
  method: fn % (boolean)
}`;
  const expectation = [
    T.comment("; this comment is above `Example`", 1, 1),
    T.spec(2, 1),
    T.id("Example", 2, 6),
    T.nest(2, 14),
    T.comment("; this comment is above `method`", 3, 3),
    T.id("method", 4, 3),
    T.setter_1(4, 9),
    T.id("fn", 4, 11),
    T.mod(4, 14),
    T.open_tuple(4, 16),
    T.id("boolean", 4, 17),
    T.close_tuple(4, 24),
    T.denest(5, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("yields each multiline comment as a special token", () => {
  const input = `/**
 * this comment is above \`Example\`
 */
spec Example {
  /**
   * this comment is above \`method\`
   */
  method: fn % (boolean)
}`;
  const expectation = [
    T.multiline_comment(
      `/**
 * this comment is above \`Example\`
 */`,
      1,
      1,
    ),
    T.spec(4, 1),
    T.id("Example", 4, 6),
    T.nest(4, 14),
    T.multiline_comment(
      `/**
   * this comment is above \`method\`
   */`,
      5,
      3,
    ),
    T.id("method", 8, 3),
    T.setter_1(8, 9),
    T.id("fn", 8, 11),
    T.mod(8, 14),
    T.open_tuple(8, 16),
    T.id("boolean", 8, 17),
    T.close_tuple(8, 24),
    T.denest(9, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});

Deno.test("tokenizes type definition successfully given minimized input", () => {
  const input = `spec Example{method:fn%(input:string,boolean)}`;
  const expectation = [
    T.spec(1, 1),
    T.id("Example", 1, 6),
    T.nest(1, 13),
    T.id("method", 1, 14),
    T.setter_1(1, 20),
    T.id("fn", 1, 21),
    T.mod(1, 23),
    T.open_tuple(1, 24),
    T.id("input", 1, 22),
    T.close_tuple(1, 29),
    T.denest(1, 1),
  ];
  const reality = [...tokenize(input)];
  assertEquals(expectation, reality);
});
