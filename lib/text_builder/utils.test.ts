import { assertEquals } from "../../deps/std/testing.ts";
import { T } from "../tokenize/mod.ts";
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
