import { assertEquals } from "@std/assert";
import { Lexeme } from "./lexeme.ts";
import { T } from "./t.ts";

Deno.test("T alias generator methods create tokens matching all lexeme values", () => {
  assertEquals(T.id("abc", 1, 1).kind, Lexeme.Identifier);
  assertEquals(T.id("abc", 1, 1).value, "abc");

  assertEquals(T.load(1, 1).kind, Lexeme.Load);
  assertEquals(T.nest(1, 1).kind, Lexeme.StructOpener);
  assertEquals(T.denest(1, 1).kind, Lexeme.StructCloser);
  assertEquals(T.open_tuple(1, 1).kind, Lexeme.TupleOpener);
  assertEquals(T.close_tuple(1, 1).kind, Lexeme.TupleCloser);
  assertEquals(T.type(1, 1).kind, Lexeme.TypeDefiner);
  assertEquals(T.spec(1, 1).kind, Lexeme.TypeDefiner);
  assertEquals(T.setter_1(1, 1).kind, Lexeme.PropertyDefiner);
  assertEquals(T.optional(1, 1).kind, Lexeme.PropertyOptionalMarker);
  assertEquals(T.setter_2(1, 1).kind, Lexeme.PropertyOptionalDefiner);
  assertEquals(T.mod(1, 1).kind, Lexeme.Modifier);
  assertEquals(T.text_1("hello", 1, 1).kind, Lexeme.TextLiteral);
  assertEquals(T.text_2("hello", 1, 1).kind, Lexeme.TextLiteral);
  assertEquals(T.text_3("hello", 1, 1).kind, Lexeme.TextLiteral);
  assertEquals(T.comment("; hello", 1, 1).kind, Lexeme.InlineComment);
  assertEquals(T.multiline_comment("/* hello */", 1, 1).kind, Lexeme.MultilineComment);
  assertEquals(T.separator(1, 1).kind, Lexeme.Separator);
  assertEquals(T.unknown("&", 1, 1).kind, Lexeme.Unknown);
});

