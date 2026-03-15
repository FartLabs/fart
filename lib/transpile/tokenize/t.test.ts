import { assertEquals } from "@std/assert";
import { Lexicon } from "./lexicon.ts";
import { T } from "./t.ts";

Deno.test("T alias generator methods create tokens matching all lexicon values", () => {
  assertEquals(T.id("abc", 1, 1).kind, Lexicon.Identifier);
  assertEquals(T.id("abc", 1, 1).value, "abc");

  assertEquals(T.load(1, 1).kind, Lexicon.Load);
  assertEquals(T.nest(1, 1).kind, Lexicon.StructOpener);
  assertEquals(T.denest(1, 1).kind, Lexicon.StructCloser);
  assertEquals(T.open_tuple(1, 1).kind, Lexicon.TupleOpener);
  assertEquals(T.close_tuple(1, 1).kind, Lexicon.TupleCloser);
  assertEquals(T.type(1, 1).kind, Lexicon.TypeDefiner);
  assertEquals(T.spec(1, 1).kind, Lexicon.TypeDefiner);
  assertEquals(T.setter_1(1, 1).kind, Lexicon.PropertyDefiner);
  assertEquals(T.optional(1, 1).kind, Lexicon.PropertyOptionalMarker);
  assertEquals(T.setter_2(1, 1).kind, Lexicon.PropertyOptionalDefiner);
  assertEquals(T.mod(1, 1).kind, Lexicon.Modifier);
  assertEquals(T.text_1("hello", 1, 1).kind, Lexicon.TextLiteral);
  assertEquals(T.text_2("hello", 1, 1).kind, Lexicon.TextLiteral);
  assertEquals(T.text_3("hello", 1, 1).kind, Lexicon.TextLiteral);
  assertEquals(T.comment("; hello", 1, 1).kind, Lexicon.InlineComment);
  assertEquals(T.multiline_comment("/* hello */", 1, 1).kind, Lexicon.MultilineComment);
  assertEquals(T.separator(1, 1).kind, Lexicon.Separator);
  assertEquals(T.unknown("&", 1, 1).kind, Lexicon.Unknown);
});

