import { LEXICON, Lexicon, LexiconType } from "./lexicon.ts";
import { Token } from "./token.ts";
import { findInLexicon } from "./utils.ts";

/**
 * Object used to memoize the process of properly tokenizing
 * Fart syntax.
 */
interface TokenizationState {
  char: null | string;
  prevChar: null | string;
  substr: string; // contains the current keyword or identifier being tokenized
  prevSubstr: string;
  line: number;
  column: number;
  oldColumn: number | null;
  yieldingChar: boolean; // if true, yields character as token at end of iteration
  yieldingSubstr: boolean; // if true, yields substring as token at end of iteration
  yieldingInlineComment: boolean; // if true, yields substring as comment at end of line
  yieldingMultilineComment: boolean; // if true, yields substring as comment at end of comment (*/)
  breakingLine: boolean; // if true, updates line and column counts at end of iteration
}

export type FartTokenGenerator = Generator<
  Token,
  undefined,
  string | undefined
>;

const INITIAL_TOKENIZATION_STATE: Readonly<TokenizationState> = Object.freeze({
  char: null,
  prevChar: null,
  substr: "",
  prevSubstr: "",
  line: 1,
  column: 1,
  oldColumn: null,
  yieldingChar: false,
  yieldingSubstr: false,
  yieldingInlineComment: false,
  yieldingMultilineComment: false,
  breakingLine: false,
});

export function* tokenize(
  input: string,
  lex: LexiconType = LEXICON,
): FartTokenGenerator {
  const memo = { ...INITIAL_TOKENIZATION_STATE };

  while (input.length > 0) {
    memo.char = input[0];
    memo.yieldingChar = INITIAL_TOKENIZATION_STATE.yieldingChar;
    memo.yieldingSubstr = INITIAL_TOKENIZATION_STATE.yieldingSubstr;
    memo.breakingLine = INITIAL_TOKENIZATION_STATE.breakingLine;

    // this variable keeps track of whether or not all characters are
    // included when building the substring or not.
    const catchAllChars = memo.yieldingInlineComment ||
      memo.yieldingMultilineComment;

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
      case Lexicon.PropertyDefiner:
      case Lexicon.Modifier:
      case Lexicon.Separator: {
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
        if (!catchAllChars) memo.substr += memo.char;
        break;
      }
    }

    // yield and reset substring if substring is to be yielded
    if (memo.yieldingSubstr && memo.substr.length > 0 && !catchAllChars) {
      yield new Token(memo.substr, memo.line, memo.column - memo.substr.length);
      memo.prevSubstr = memo.substr;
      memo.substr = INITIAL_TOKENIZATION_STATE.substr;
    }

    // if the current character is to be yielded, it must be yielded
    // _after_ the substring
    if (memo.yieldingChar && memo.char !== null && !catchAllChars) {
      // if a '?' comes before a ':', then they are combined and yielded as a `?:`
      if (
        findInLexicon(memo.prevChar, lex) === Lexicon.PropertyOptionalMarker &&
        findInLexicon(memo.char, lex) === Lexicon.PropertyDefiner
      ) {
        yield new Token(memo.prevChar + memo.char, memo.line, memo.column - 1);
      } else {
        yield new Token(memo.char, memo.line, memo.column);
      }
    }

    // if a '/*' occurs, then multiline comment mode is enabled
    if (memo.prevChar === "/" && memo.char === "*") {
      memo.yieldingMultilineComment = true;
      memo.oldColumn = memo.column;
      memo.substr = memo.substr.slice(0, memo.substr.length - 1); // offset substring
      // if a '*/' occurs, then multiline comment mode is disabled
    } else if (
      memo.yieldingMultilineComment && memo.prevChar === "*" &&
      memo.char === "/"
    ) {
      memo.substr += memo.char;
      const commentLines = memo.substr.split("\n").length - 1;
      yield new Token(
        memo.substr,
        memo.line - commentLines,
        (memo.oldColumn ?? 2) - 1,
      );
      memo.prevSubstr = memo.substr;
      memo.substr = INITIAL_TOKENIZATION_STATE.substr;
      memo.oldColumn = null;
      memo.yieldingMultilineComment = false;
      // if a ';' occurs, then inline comment mode is enabled
    } else if (memo.char === ";") {
      memo.yieldingInlineComment = true;
      memo.substr = memo.substr.slice(0, memo.substr.length - 1); // offset substring
    }

    // when a line is broken, set the column count to it's initial
    // value and increment the line count by one
    if (memo.breakingLine) {
      // if a line is broken in inline comment mode, then the comment
      // is yielded
      if (memo.yieldingInlineComment) {
        yield new Token(
          memo.substr,
          memo.line,
          memo.column - memo.substr.length,
        );
        memo.prevSubstr = memo.substr;
        memo.substr = INITIAL_TOKENIZATION_STATE.substr;
        memo.yieldingInlineComment = false;
      }
      memo.column = INITIAL_TOKENIZATION_STATE.column - 1;
      memo.line++;
    }

    // if in inline/multiline comment mode or string literal mode, all
    // characters are unconditionally included into the substring
    if (memo.yieldingInlineComment || memo.yieldingMultilineComment) {
      memo.substr += memo.char;
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
