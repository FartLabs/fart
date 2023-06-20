import { LEXICON, Lexicon } from "../consts/lexicon.ts";
import { Token } from "./token.ts";

interface LexiconUtil {
  "id": (raw: string, line: number, column: number) => Token;
  "string_literal": (raw: string, line: number, column: number) => Token;
  "nester": (line: number, column: number) => Token;
  "denester": (line: number, column: number) => Token;
  "opening_angle": (line: number, column: number) => Token;
  "closing_angle": (line: number, column: number) => Token;
  "setter": (line: number, column: number) => Token;
  "required_setter": (line: number, column: number) => Token;
  "type_definer": (line: number, column: number) => Token;
  "depo_definer": (line: number, column: number) => Token;
  "load_definer": (line: number, column: number) => Token;
  "commenter": (line: number, column: number) => Token;
  "separator": (line: number, column: number) => Token;
  "spacer": (line: number, column: number) => Token;
  "line_breaker": (line: number, column: number) => Token;
  "line_breaker2": (line: number, column: number) => Token;
  "modifier": (line: number, column: number) => Token;
  "string_marker": (line: number, column: number) => Token;
  "string_marker2": (line: number, column: number) => Token;
  "string_marker3": (line: number, column: number) => Token;
  "comment": (raw: string, line: number, column: number) => Token;
  "eof": (line: number, column: number) => Token;
}

export const T: LexiconUtil = {
  "id": (raw, line, column) => new Token(raw, line, column),
  "string_literal": (raw, line, column) => new Token(raw, line, column),
  "nester": (line, column) => new Token(LEXICON[Lexicon.Nester], line, column),
  "denester": (line, column) =>
    new Token(LEXICON[Lexicon.Denester], line, column),
  "opening_angle": (line, column) =>
    new Token(LEXICON[Lexicon.OpeningAngle], line, column),
  "closing_angle": (line, column) =>
    new Token(LEXICON[Lexicon.ClosingAngle], line, column),
  "setter": (line, column) => new Token(LEXICON[Lexicon.Setter], line, column),
  "required_setter": (line, column) =>
    new Token(LEXICON[Lexicon.RequiredSetter], line, column),
  "type_definer": (line, column) =>
    new Token(LEXICON[Lexicon.TypeDefiner], line, column),
  "depo_definer": (line, column) =>
    new Token(LEXICON[Lexicon.DepoDefiner], line, column),
  "load_definer": (line, column) =>
    new Token(LEXICON[Lexicon.LoadDefiner], line, column),
  "commenter": (line, column) =>
    new Token(LEXICON[Lexicon.Commenter], line, column),
  "separator": (line, column) =>
    new Token(LEXICON[Lexicon.Separator], line, column),
  "spacer": (line, column) => new Token(LEXICON[Lexicon.Spacer], line, column),
  "line_breaker": (line, column) =>
    new Token(LEXICON[Lexicon.LineBreaker], line, column),
  "line_breaker2": (line, column) =>
    new Token(LEXICON[Lexicon.LineBreaker2], line, column),
  "modifier": (line, column) =>
    new Token(LEXICON[Lexicon.Modifier], line, column),
  "string_marker": (line, column) =>
    new Token(LEXICON[Lexicon.StringMarker], line, column),
  "string_marker2": (line, column) =>
    new Token(LEXICON[Lexicon.StringMarker2], line, column),
  "string_marker3": (line, column) =>
    new Token(LEXICON[Lexicon.StringMarker3], line, column),
  "comment": (raw, line, column) => new Token(raw, line, column),
  "eof": (line, column) => new Token(LEXICON[Lexicon.EOF], line, column),
};
