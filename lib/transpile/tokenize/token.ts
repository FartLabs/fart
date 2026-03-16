import { LEXEME, Lexeme } from "./lexeme.ts";
import {
  checkIsIdentifier,
  checkIsInlineComment,
  checkIsMultilineComment,
  checkIsTextLiteral,
  findInLexeme,
} from "./utils.ts";

export class Token {
  public kind: Lexeme | null = null;

  constructor(
    private raw: string,
    public line = -1,
    public column = -1,
    noCheck = false,
  ) {
    this.kind = noCheck ? Lexeme.Identifier : Token.getKindOf(raw);
  }

  is(kind: Lexeme | null): boolean {
    return this.kind === kind;
  }

  toString() {
    return this.value;
  }

  get value(): string {
    switch (this.kind) {
      case Lexeme.TextLiteral: {
        // strips expected text markers from beginning and end of input string
        return this.raw.slice(1, this.raw.length - 1);
      }
      case Lexeme.InlineComment: {
        return this.raw.slice(1).trim();
      }
      case Lexeme.MultilineComment: {
        return this.raw.slice(2, this.raw.length - 2).trim();
      }
      default: {
        return this.raw;
      }
    }
  }

  static getKindOf(raw: string): Lexeme {
    const matchingKind = findInLexeme(raw, LEXEME);
    if (matchingKind !== null) return matchingKind;
    if (checkIsIdentifier(raw)) return Lexeme.Identifier;
    if (checkIsTextLiteral(raw)) return Lexeme.TextLiteral;
    if (checkIsInlineComment(raw)) return Lexeme.InlineComment;
    if (checkIsMultilineComment(raw)) return Lexeme.MultilineComment;
    return Lexeme.Unknown;
  }
}
