// This file simply exports an object which contains lightweight
// functions for creating Token instances with fewer keystrokes;
// used primarily for testing-purposes.

import { LEXICON, Lexicon } from "./lexicon.ts";
import { Token } from "./token.ts";

type SimpleTokenMaker = (line: number, col: number) => Token;
type SpecialTokenMaker = (raw: string, line: number, col: number) => Token;

interface LexiconAliasLayer {
  /** `___` — identifier */
  id: SpecialTokenMaker;
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
  /** `?` — optional marker */
  optional: SimpleTokenMaker;
  /** `:` — required setter */
  setter_1: SimpleTokenMaker;
  /** `?:` — optional setter */
  setter_2: SimpleTokenMaker;
  /** `%` — modifier */
  mod: SimpleTokenMaker;
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
  /** unknown */
  unknown: SpecialTokenMaker;
}

const makeSpecialToken: SpecialTokenMaker = (raw, line, col) =>
  new Token(raw, line, col);

const NEST = LEXICON.get(Lexicon.StructOpener) as string;
const DENEST = LEXICON.get(Lexicon.StructCloser) as string;
const OPEN_TUPLE = LEXICON.get(Lexicon.TupleOpener) as string;
const CLOSE_TUPLE = LEXICON.get(Lexicon.TupleCloser) as string;
const TYPE = (LEXICON.get(Lexicon.TypeDefiner) as [string])[0];
const OPTIONAL = LEXICON.get(Lexicon.PropertyOptionalMarker) as string;
const SETTER_1 = LEXICON.get(Lexicon.PropertyDefiner) as string;
const SETTER_2 = LEXICON.get(Lexicon.PropertyOptionalDefiner) as string;
const MODIFIER = LEXICON.get(Lexicon.Modifier) as string;

export const T: LexiconAliasLayer = {
  id: makeSpecialToken,
  nest: (line, col) => new Token(NEST, line, col),
  denest: (line, col) => new Token(DENEST, line, col),
  open_tuple: (line, col) => new Token(OPEN_TUPLE, line, col),
  close_tuple: (line, col) => new Token(CLOSE_TUPLE, line, col),
  type: (line, col) => new Token(TYPE, line, col),
  optional: (line, col) => new Token(OPTIONAL, line, col),
  setter_1: (line, col) => new Token(SETTER_1, line, col),
  setter_2: (line, col) => new Token(SETTER_2, line, col),
  mod: (line, col) => new Token(MODIFIER, line, col),
  text_1: (raw, line, col) => new Token(`"${raw}"`, line, col),
  text_2: (raw, line, col) => new Token(`'${raw}'`, line, col),
  text_3: (raw, line, col) => new Token(`\`${raw}\``, line, col),
  comment: makeSpecialToken,
  unknown: makeSpecialToken,
} as const;

export default T;