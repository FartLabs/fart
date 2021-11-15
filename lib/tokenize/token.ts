import { Lexicon } from "./lexicon.ts";
import {
  checkIsIdentifier,
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
        return this.value.slice(1, this.value.length - 1);
      }
      default: {
        return this.raw;
      }
    }
  }

  static getKindOf(raw: string): Lexicon {
    const matchingKind = findInLexicon(raw);
    if (matchingKind !== null) return matchingKind;
    if (checkIsIdentifier(raw)) return Lexicon.Identifier;
    if (checkIsTextLiteral(raw)) return Lexicon.TextLiteral;
    return Lexicon.Unknown;
  }
}
