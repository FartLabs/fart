import { LEXICON, Lexicon } from "./lexicon.ts";

export class Token {
  public kind: Lexicon | null = null;
  public line: number = -1;
  public column: number = -1;

  constructor(
    private raw: string,
    line: number,
    column: number,
    noCheck = false,
  ) {
    this.line = line;
    this.column = column;
    this.kind = noCheck ? Lexicon.Identifier : Token.getKindOf(raw);
  }

  // https://github.com/EthanThatOneKid/fart/blob/c43f2333458b2cbc40d167610d87e2a2e3f89885/lib/tokenize/token.ts?_pjax=%23js-repo-pjax-container%2C%20div%5Bitemtype%3D%22http%3A%2F%2Fschema.org%2FSoftwareSourceCode%22%5D%20main%2C%20%5Bdata-pjax-container%5D#L48
  static getKindOf(raw: string): Lexicon | null {}
}
