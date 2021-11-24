import { LEXICON, Lexicon } from "./lexicon.ts";
import { Token } from "./token.ts";
import { findInLexicon } from "./utils.ts";

/**
 * Object used to memoize the process of properly tokenizing
 * Fart syntax.
 */
interface TokenizationState {
  char: null | string;
  prevChar: null | string;
  substr: string;
  prevSubstr: string;
  line: number;
  column: number;
  yieldingChar: boolean; // if true, yields character as token at end of iteration
  yieldingSubstr: boolean; // if true, yields substring as token at end of iteration
  yieldingInlineComment: boolean; // if true, yields substring as comment at end of line
  yieldingMultilineComment: boolean; // if true, yields substring as comment at end of comment (*/)
  breakingLine: boolean; // if true, updates line and column counts at end of iteration
}

type FartTokenGenerator = Generator<Token, undefined, undefined | Token>;

const INITIAL_TOKENIZATION_STATE: Readonly<TokenizationState> = Object.freeze({
  char: null,
  prevChar: null,
  substr: "",
  prevSubstr: "",
  line: 1,
  column: 1,
  yieldingChar: false,
  yieldingSubstr: false,
  yieldingInlineComment: false,
  yieldingMultilineComment: false,
  breakingLine: false,
});

export function* tokenize(
  input: string,
  lex: ReadonlyMap<Lexicon, string | string[] | null> = LEXICON,
): FartTokenGenerator {
  const memo = { ...INITIAL_TOKENIZATION_STATE };

  while (input.length > 0) {
    memo.char = input[0];
    memo.yieldingChar = INITIAL_TOKENIZATION_STATE.yieldingChar;
    memo.yieldingSubstr = INITIAL_TOKENIZATION_STATE.yieldingSubstr;
    memo.breakingLine = INITIAL_TOKENIZATION_STATE.breakingLine;

    switch (findInLexicon(memo.char, lex)) {
      // when a line break occurs, increment the line count, set column back to initial,
      // and the current substring should become a token.
      case Lexicon.EOF: {
        memo.breakingLine = true;
        memo.yieldingSubstr = true;
        break;
      }
      case Lexicon.StructOpener:
      case Lexicon.StructCloser:
      case Lexicon.TupleOpener:
      case Lexicon.TupleCloser:
      case Lexicon.PropertyDefiner: {
        memo.yieldingChar = true;
        memo.yieldingSubstr = true;
        break;
      }
      case Lexicon.PropertyOptionalMarker:
      case Lexicon.Whitespace: {
        memo.yieldingSubstr = true;
        break;
      }
      default: {
        memo.substr += memo.char;
        break;
      }
    }

    // yield and reset substring if substring is to be yielded
    if (memo.yieldingSubstr && memo.substr.length > 0) {
      yield new Token(memo.substr, memo.line, memo.column - memo.substr.length);
      memo.prevSubstr = memo.substr;
      memo.substr = INITIAL_TOKENIZATION_STATE.substr;
    }

    // if the current character is to be yielded, it must be yielded
    // _after_ the substring.
    if (memo.yieldingChar && memo.char !== null) {
      // if a '?' comes before a ':', then they are combined and yielded as a `?:`.
      if (
        findInLexicon(memo.prevChar, lex) === Lexicon.PropertyOptionalMarker &&
        findInLexicon(memo.char, lex) === Lexicon.PropertyDefiner
      ) {
        yield new Token(memo.prevChar + memo.char, memo.line, memo.column - 1);
      } else {
        yield new Token(memo.char, memo.line, memo.column);
      }
    }

    // when a line is broken, set the column count to it's initial
    // value and increment the line count by one.
    if (memo.breakingLine) {
      memo.column = INITIAL_TOKENIZATION_STATE.column - 1;
      memo.line++;
    }

    // column count is incremented per iteration
    memo.column++;

    // current character is discarded but set as previous.
    memo.prevChar = memo.char;
    input = input.slice(1);
  }

  // yield substring if one is left unresolved
  if (memo.substr.length > 0) {
    yield new Token(memo.substr, memo.line, memo.column - memo.substr.length);
  }

  return;
}
