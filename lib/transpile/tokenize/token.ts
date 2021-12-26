import { LEXICON, Lexicon } from "./lexicon.ts";
import {
  checkIsIdentifier,
  checkIsInlineComment,
  checkIsMultilineComment,
  checkIsTextLiteral,
  findInLexicon,
} from "./utils.ts";

export class Token {
  public kind: Lexicon | null = null;

  constructor(
    private raw: string,
    public line = -1,
    public column = -1,
    noCheck = false,
  ) {
    this.kind = noCheck ? Lexicon.Identifier : Token.getKindOf(raw);
  }

  is(kind: Lexicon | null): boolean {
    return this.kind === kind;
  }

  toString() {
    return this.value;
  }

  get value(): string {
    switch (this.kind) {
      case Lexicon.TextLiteral: {
        // strips expected text markers from beginning and end of input string
        return this.raw.slice(1, this.raw.length - 1);
      }
      case Lexicon.InlineComment: {
        return this.raw.slice(1).trim();
      }
      case Lexicon.MultilineComment: {
        return this.raw.slice(2, this.raw.length - 2).trim();
      }
      default: {
        return this.raw;
      }
    }
  }

  static getKindOf(raw: string): Lexicon {
    const matchingKind = findInLexicon(raw, LEXICON);
    if (matchingKind !== null) return matchingKind;
    if (checkIsIdentifier(raw)) return Lexicon.Identifier;
    if (checkIsTextLiteral(raw)) return Lexicon.TextLiteral;
    if (checkIsInlineComment(raw)) return Lexicon.InlineComment;
    if (checkIsMultilineComment(raw)) return Lexicon.MultilineComment;
    return Lexicon.Unknown;
  }
}
