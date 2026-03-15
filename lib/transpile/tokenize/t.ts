// deno-lint-ignore-file camelcase
// This file simply exports an object which contains lightweight
// functions for creating Token instances with fewer keystrokes;
// used primarily for testing-purposes.

import { LEXEME, Lexeme } from "./lexeme.ts";
import { Token } from "./token.ts";

type SimpleTokenMaker = (line: number, col: number) => Token;
type SpecialTokenMaker = (raw: string, line: number, col: number) => Token;

export interface LexemeAliasLayer {
  /** `___` — identifier */
  id: SpecialTokenMaker;
  /** `load` — struct opener */
  load: SimpleTokenMaker;
  /** `{` — struct opener */
  nest: SimpleTokenMaker;
  /** `}` — struct closer */
  denest: SimpleTokenMaker;
  /** `(` — tuple opener */
  open_tuple: SimpleTokenMaker;
  /** `)` — tuple closer */
  close_tuple: SimpleTokenMaker;
  /** `type` — type definer */
  type: SimpleTokenMaker;
  /** `spec` — type definer alias */
  spec: SimpleTokenMaker;
  /** `?` — optional marker */
  optional: SimpleTokenMaker;
  /** `:` — required setter */
  setter_1: SimpleTokenMaker;
  /** `?:` — optional setter */
  setter_2: SimpleTokenMaker;
  /** `%` — modifier */
  mod: SimpleTokenMaker;
  /** `,` — separator */
  separator: SimpleTokenMaker;
  /** `"___"` — text literal (do not include quotes) */
  text_1: SpecialTokenMaker;
  /** `'___'` — text literal (do not include quotes) */
  text_2: SpecialTokenMaker;
  /** ```
   * `___`
   * ``` — text literal (do not include quotes) */
  text_3: SpecialTokenMaker;
  /** `;___` —  comment (include semicolon) */
  comment: SpecialTokenMaker;
  /** `/* ___ *\/` —  comment (include edges) */
  multiline_comment: SpecialTokenMaker;
  /** unknown */
  unknown: SpecialTokenMaker;
}

const makeSpecialToken: SpecialTokenMaker = (raw, line, col) =>
  new Token(raw, line, col);

const LOAD = LEXEME.get(Lexeme.Load) as string;
const NEST = LEXEME.get(Lexeme.StructOpener) as string;
const DENEST = LEXEME.get(Lexeme.StructCloser) as string;
const OPEN_TUPLE = LEXEME.get(Lexeme.TupleOpener) as string;
const CLOSE_TUPLE = LEXEME.get(Lexeme.TupleCloser) as string;
const [TYPE, SPEC] = LEXEME.get(Lexeme.TypeDefiner) as [string, string];
const OPTIONAL = LEXEME.get(Lexeme.PropertyOptionalMarker) as string;
const SETTER_1 = LEXEME.get(Lexeme.PropertyDefiner) as string;
const SETTER_2 = LEXEME.get(Lexeme.PropertyOptionalDefiner) as string;
const MODIFIER = LEXEME.get(Lexeme.Modifier) as string;
const SEPARATOR = LEXEME.get(Lexeme.Separator) as string;

export const T: LexemeAliasLayer = {
  id: makeSpecialToken,
  load: (line, col) => new Token(LOAD, line, col),
  nest: (line, col) => new Token(NEST, line, col),
  denest: (line, col) => new Token(DENEST, line, col),
  open_tuple: (line, col) => new Token(OPEN_TUPLE, line, col),
  close_tuple: (line, col) => new Token(CLOSE_TUPLE, line, col),
  type: (line, col) => new Token(TYPE, line, col),
  spec: (line, col) => new Token(SPEC, line, col),
  optional: (line, col) => new Token(OPTIONAL, line, col),
  setter_1: (line, col) => new Token(SETTER_1, line, col),
  setter_2: (line, col) => new Token(SETTER_2, line, col),
  mod: (line, col) => new Token(MODIFIER, line, col),
  separator: (line, col) => new Token(SEPARATOR, line, col),
  text_1: (raw, line, col) => new Token(`"${raw}"`, line, col),
  text_2: (raw, line, col) => new Token(`'${raw}'`, line, col),
  text_3: (raw, line, col) => new Token(`\`${raw}\``, line, col),
  comment: makeSpecialToken,
  multiline_comment: makeSpecialToken,
  unknown: makeSpecialToken,
} as const;

export default T;
