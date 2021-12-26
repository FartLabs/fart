import { assertEquals } from "../../../deps/std/testing.ts";
import { T, Token } from "../tokenize/mod.ts";
import { CodeBlock } from "../code_block/mod.ts";
import {
  cleanComment,
  makeFileEndEventContext,
  makeFileStartEventContext,
  makeInlineCommentEventContext,
  makeLoadEventContext,
  makeMultilineCommentEventContext,
  makeSetPropertyEventContext,
  makeStructCloseEventContext,
  makeStructOpenEventContext,
} from "./utils.ts";
import { CartridgeEvent } from "../cartridge/mod.ts";
import type {
  CartridgeEventContext,
  PropertyDefinition,
} from "../cartridge/mod.ts";

Deno.test("cleans inlined comments to extract text content", () => {
  const expectation = ["example"];
  const reality = cleanComment(T.comment("; example", 1, 1));
  assertEquals(expectation, reality);
});

Deno.test("cleans multi-inlined comments to extract text content", () => {
  const expectation = ["example"];
  const reality = cleanComment(T.multiline_comment("/* example */", 1, 1));
  assertEquals(expectation, reality);
});

Deno.test("cleans multi-inlined comments to extract text content (omits whitespace on edges)", () => {
  const expectation = ["example"];
  const reality = cleanComment(T.multiline_comment(
    `/*
  example
*/`,
    1,
    1,
  ));
  assertEquals(expectation, reality);
});

Deno.test("successfully makes a 'file_end' event context object", () => {
  const code = new CodeBlock();
  const data = null;
  const tokens: Token[] = [];
  const expectation: CartridgeEventContext<CartridgeEvent.FileEnd> = {
    type: CartridgeEvent.FileEnd,
    code,
    data,
    tokens,
  };
  const reality = makeFileEndEventContext(code, tokens);
  assertEquals(expectation, reality);
});

Deno.test("successfully makes a 'file_start' event context object", () => {
  const code = new CodeBlock();
  const data = null;
  const tokens: Token[] = [];
  const expectation: CartridgeEventContext<CartridgeEvent.FileStart> = {
    type: CartridgeEvent.FileStart,
    code,
    data,
    tokens,
  };
  const reality = makeFileStartEventContext(code, tokens);
  assertEquals(expectation, reality);
});

Deno.test("successfully makes a 'inline_comment' event context object", () => {
  const code = new CodeBlock();
  const tokens: Token[] = [T.comment("; example", 1, 1)];
  const expectation: CartridgeEventContext<CartridgeEvent.InlineComment> = {
    type: CartridgeEvent.InlineComment,
    code,
    data: {
      comments: ["example"],
    },
    tokens,
  };
  const reality = makeInlineCommentEventContext(code, tokens);
  assertEquals(expectation, reality);
});

Deno.test("successfully makes a 'multiline_comment' event context object", () => {
  const code = new CodeBlock();
  const tokens: Token[] = [T.comment("; example", 1, 1)];
  const expectation: CartridgeEventContext<CartridgeEvent.MultilineComment> = {
    type: CartridgeEvent.MultilineComment,
    code,
    tokens,
    data: {
      comments: ["example"],
    },
  };
  const reality = makeMultilineCommentEventContext(code, tokens);
  assertEquals(expectation, reality);
});

Deno.test("successfully makes a 'load' event context object", () => {
  const code = new CodeBlock();
  const source = "./example.fart";
  const dependencies = ["Example1", "Example2", "Example3"];
  const tokens: Token[] = [
    T.load(1, 1),
    T.text_1(source, 1, 6),
    T.nest(1, 23),
    T.id("Example1", 2, 3),
    T.separator(2, 11),
    T.id("Example2", 3, 3),
    T.separator(3, 11),
    T.id("Example3", 4, 3),
    T.separator(4, 11),
    T.denest(5, 1),
  ];
  const expectation: CartridgeEventContext<CartridgeEvent.Load> = {
    type: CartridgeEvent.Load,
    code,
    tokens,
    data: { source, dependencies, comments: [] },
  };
  const reality = makeLoadEventContext(
    code,
    tokens,
    /*comments=*/ [],
    source,
    dependencies,
  );
  assertEquals(expectation, reality);
});

Deno.test("successfully makes a 'set_property' event context object", () => {
  const code = new CodeBlock();
  const name = "property";
  const definition: PropertyDefinition = { value: "number" };
  const tokens: Token[] = [
    T.id(name, 2, 3),
    T.setter_1(2, 11),
    T.id("number", 2, 13),
  ];
  const expectation: CartridgeEventContext<CartridgeEvent.SetProperty> = {
    type: CartridgeEvent.SetProperty,
    code,
    tokens,
    data: { name, definition, comments: [] },
  };
  const reality = makeSetPropertyEventContext(
    code,
    tokens,
    /*comments=*/ [],
    name,
    definition,
  );
  assertEquals(expectation, reality);
});

Deno.test("successfully makes a 'struct_close' event context object", () => {
  const code = new CodeBlock();
  const tokens: Token[] = [];
  const expectation: CartridgeEventContext<CartridgeEvent.StructClose> = {
    type: CartridgeEvent.StructClose,
    code,
    tokens,
    data: null,
  };
  const reality = makeStructCloseEventContext(code, tokens);
  assertEquals(expectation, reality);
});

Deno.test("successfully makes a 'struct_open' event context object", () => {
  const code = new CodeBlock();
  const tokens: Token[] = [T.type(1, 1), T.id("Example", 1, 6), T.nest(1, 14)];
  const name = "Example";
  const expectation: CartridgeEventContext<CartridgeEvent.StructOpen> = {
    type: CartridgeEvent.StructOpen,
    code,
    tokens,
    data: {
      name,
      comments: [],
    },
  };
  const reality = makeStructOpenEventContext(
    code,
    tokens,
    /*comments=*/ [],
    name,
  );
  assertEquals(expectation, reality);
});
