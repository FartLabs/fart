import { LEXICON, Lexicon } from "./constants/lexicon.ts";
import { validateIdentifier, validateStringLiteral } from "./utils.ts";

export class Token {
  public kind: Lexicon | null;
  constructor(
    private raw: string,
    public line: number,
    public column: number,
  ) {
    this.kind = Token.getKindOf(raw);
  }

  get value(): string {
    switch (this.kind) {
      case Lexicon.Identifier:
        return this.raw;
      case Lexicon.StringLiteral: {
        const clean = (stringLiteral: string): string => {
          const marker = LEXICON[Lexicon.StringMarker];
          const pattern = new RegExp(`^\\${marker}|\\${marker}$`, "g");
          return stringLiteral.replace(pattern, "");
        };
        return clean(this.raw);
      }
      default: {
        if (this.kind !== null && LEXICON[this.kind] !== undefined) {
          return LEXICON[this.kind];
        }
        throw new Error(`Invalid token`);
      }
    }
  }

  is(kind: Lexicon | null): boolean {
    return this.kind === kind;
  }

  toString() {
    return this.value;
  }

  static getKindOf(raw: string): Lexicon | null {
    switch (raw) {
      case LEXICON[Lexicon.Nester]:
        return Lexicon.Nester;
      case LEXICON[Lexicon.Denester]:
        return Lexicon.Denester;
      case LEXICON[Lexicon.OpeningAngle]:
        return Lexicon.OpeningAngle;
      case LEXICON[Lexicon.ClosingAngle]:
        return Lexicon.ClosingAngle;
      case LEXICON[Lexicon.RequiredMarker]:
        return Lexicon.RequiredMarker;
      case LEXICON[Lexicon.Setter]:
        return Lexicon.Setter;
      case LEXICON[Lexicon.RequiredSetter]:
        return Lexicon.RequiredSetter;
      case LEXICON[Lexicon.TypeDefiner]:
        return Lexicon.TypeDefiner;
      case LEXICON[Lexicon.DepoDefiner]:
        return Lexicon.DepoDefiner;
      case LEXICON[Lexicon.ImpoDefiner]:
        return Lexicon.ImpoDefiner;
      case LEXICON[Lexicon.Commenter]:
        return Lexicon.Commenter;
      case LEXICON[Lexicon.Separator]:
        return Lexicon.Separator;
      case LEXICON[Lexicon.Spacer]:
        return Lexicon.Spacer;
      case LEXICON[Lexicon.LineBreaker]:
        return Lexicon.LineBreaker;
      case LEXICON[Lexicon.LineBreaker2]:
        return Lexicon.LineBreaker2;
      case LEXICON[Lexicon.EOF]:
        return Lexicon.EOF;
      default: {
        if (validateIdentifier(raw)) return Lexicon.Identifier;
        else if (validateStringLiteral(raw)) return Lexicon.StringLiteral;
        else return null;
      }
    }
  }
}

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
  "impo_definer": (line: number, column: number) => Token;
  "commenter": (line: number, column: number) => Token;
  "separator": (line: number, column: number) => Token;
  "spacer": (line: number, column: number) => Token;
  "line_breaker": (line: number, column: number) => Token;
  "line_breaker2": (line: number, column: number) => Token;
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
  "impo_definer": (line, column) =>
    new Token(LEXICON[Lexicon.ImpoDefiner], line, column),
  "commenter": (line, column) =>
    new Token(LEXICON[Lexicon.Commenter], line, column),
  "separator": (line, column) =>
    new Token(LEXICON[Lexicon.Separator], line, column),
  "spacer": (line, column) => new Token(LEXICON[Lexicon.Spacer], line, column),
  "line_breaker": (line, column) =>
    new Token(LEXICON[Lexicon.LineBreaker], line, column),
  "line_breaker2": (line, column) =>
    new Token(LEXICON[Lexicon.LineBreaker2], line, column),
  "eof": (line, column) => new Token(LEXICON[Lexicon.EOF], line, column),
};

export function* tokenize(
  content: string,
): Generator<Token, Token, undefined> {
  let currentToken = "";
  let commentMode = false;
  let stringLiteralMode = false;
  let lineCount = 1;
  let columnCount = 0;
  const makeToken = (
    raw: string,
    lineOffset = 0,
    columnOffset = 0,
  ) => {
    const tokenLine = lineCount + lineOffset;
    const tokenColumn =
      (raw.length === 1 ? columnCount : columnCount - raw.length) +
      columnOffset;
    return new Token(raw, tokenLine, tokenColumn);
  };
  const breakLine = (
    breaker: (
      | typeof LEXICON[Lexicon.LineBreaker]
      | typeof LEXICON[Lexicon.LineBreaker2]
    ),
  ) => {
    if (breaker === LEXICON[Lexicon.LineBreaker]) {
      lineCount++;
      columnCount = 0;
      commentMode = false;
    }
  };
  const closeCurrentToken = (
    currentCharacter: string | null = null,
  ): Token | null => {
    if (currentToken.length === 0 || commentMode) return null;
    let nextToken: string | null = currentCharacter;
    switch (currentToken) {
      case LEXICON[Lexicon.Spacer]:
      case LEXICON[Lexicon.LineBreaker]:
      case LEXICON[Lexicon.LineBreaker2]: {
        break;
      }
      case LEXICON[Lexicon.TypeDefiner]:
      case LEXICON[Lexicon.DepoDefiner]:
      case LEXICON[Lexicon.ImpoDefiner]:
      case LEXICON[Lexicon.RequiredMarker]:
      case LEXICON[Lexicon.Setter]: {
        nextToken = currentToken;
        break;
      }
      default: {
        if (
          validateIdentifier(currentToken) ||
          validateStringLiteral(currentToken)
        ) {
          nextToken = currentToken;
        } else {
          // TODO: Throw a syntax error here (expected identifier).
        }
      }
    }
    currentToken = "";
    if (nextToken !== null) {
      return makeToken(nextToken);
    }
    return null;
  };
  for (const character of content) {
    columnCount++;
    let nextToken: Token | null;
    if (
      character === LEXICON[Lexicon.LineBreaker] ||
      character === LEXICON[Lexicon.LineBreaker2]
    ) {
      nextToken = closeCurrentToken();
      if (nextToken !== null) yield nextToken;
      breakLine(character);
      continue;
    }
    if (commentMode) continue;
    if (stringLiteralMode) {
      currentToken += character;
      if (character === LEXICON[Lexicon.StringMarker]) {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        stringLiteralMode = false;
      }
      continue;
    }
    switch (character) {
      case LEXICON[Lexicon.Commenter]: {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        commentMode = true;
        break;
      }
      case LEXICON[Lexicon.StringMarker]: {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        stringLiteralMode = true;
        currentToken += character;
        break;
      }
      case LEXICON[Lexicon.Nester]:
      case LEXICON[Lexicon.Denester]:
      case LEXICON[Lexicon.OpeningAngle]:
      case LEXICON[Lexicon.ClosingAngle]:
      case LEXICON[Lexicon.Separator]: {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        yield makeToken(character);
        break;
      }
      case LEXICON[Lexicon.RequiredMarker]: {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        currentToken += character;
        break;
      }
      case LEXICON[Lexicon.Setter]: {
        nextToken = closeCurrentToken(character);
        if (nextToken !== null) {
          if (nextToken.is(Lexicon.RequiredMarker)) {
            yield makeToken(LEXICON[Lexicon.RequiredSetter], 0, 1);
          } else {
            yield nextToken;
            yield makeToken(character);
          }
        }
        break;
      }
      case LEXICON[Lexicon.Spacer]:
      case LEXICON[Lexicon.LineBreaker]:
      case LEXICON[Lexicon.LineBreaker2]: {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        break;
      }
      default: {
        if (!commentMode) currentToken += character;
        break;
      }
    }
  }
  return makeToken(LEXICON[Lexicon.EOF]);
}
