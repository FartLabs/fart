import { Lexicon, LEXICON } from "./constants/lexicon.ts";
import { validateIdentifier, validateStringLiteral } from "./utils.ts";

export class Token {
  public kind: Lexicon | null;
  constructor(
    private raw: string,
    public line: number,
    public column: number
  ) {
    this.kind = Token.getKindOf(raw);
  }

  get value() {
    switch (this.kind) {
      case Lexicon.Identifier: return this.raw;
      case Lexicon.StringLiteral: {
        const clean = (stringLiteral: string) =>{
          const marker = LEXICON[Lexicon.StringMarker];
          const pattern = new RegExp(`^\\${marker}|\\${marker}$`, 'g')
          stringLiteral.replace(pattern, "");
        };
        return clean(this.raw);
      }
      default: {
        if (this.kind !== null && LEXICON[this.kind] !== undefined) {
          return LEXICON[this.kind];
        }
        return null;
      }
    }
  }
  
  static getKindOf(raw: string): Lexicon | null {
    switch (raw) {
      case LEXICON[Lexicon.Nester]: return Lexicon.Nester;
      case LEXICON[Lexicon.Denester]: return Lexicon.Denester;
      case LEXICON[Lexicon.OpeningAngle]: return Lexicon.OpeningAngle;
      case LEXICON[Lexicon.ClosingAngle]: return Lexicon.ClosingAngle;
      case LEXICON[Lexicon.Setter]: return Lexicon.Setter;
      case LEXICON[Lexicon.RequiredMarker]: return Lexicon.RequiredMarker;
      case LEXICON[Lexicon.TypeDefiner]: return Lexicon.TypeDefiner;
      case LEXICON[Lexicon.DepoDefiner]: return Lexicon.DepoDefiner;
      case LEXICON[Lexicon.ImpoDefiner]: return Lexicon.ImpoDefiner;
      case LEXICON[Lexicon.Commenter]: return Lexicon.Commenter;
      case LEXICON[Lexicon.Separator]: return Lexicon.Separator;
      case LEXICON[Lexicon.Spacer]: return Lexicon.Spacer;
      case LEXICON[Lexicon.LineBreaker]: return Lexicon.LineBreaker;
      case LEXICON[Lexicon.LineBreaker2]: return Lexicon.LineBreaker2;
      case LEXICON[Lexicon.EOF]: return Lexicon.EOF;
      default: {
        if (validateIdentifier(raw)) return Lexicon.Identifier;
        else if (validateStringLiteral(raw)) return Lexicon.StringLiteral;
        else return null;
      }
    }
  }
}

export function* tokenize(
  content: string,
): Generator<Token, Token, undefined> {
  let currentToken = "";
  let commentMode = false;
  let stringLiteralMode = false;
  let lineCount = 1;
  let columnCount = 0;
  const makeToken = (raw: string) => new Token(raw, lineCount, columnCount);
  const breakLine = (breaker: typeof LEXICON[Lexicon.LineBreaker] | typeof LEXICON[Lexicon.LineBreaker2]) => {
    if (breaker === LEXICON[Lexicon.LineBreaker]) {
      lineCount++;
      columnCount = 0;
      commentMode = false;
    }
  };
  const closeCurrentToken = (currentCharacter: string | null = null): Token | null => {
    if (currentToken.length === 0 || commentMode) return null;
    let nextToken: string | null = currentCharacter;
    switch (currentToken) {
      case LEXICON[Lexicon.Spacer]:
      case LEXICON[Lexicon.LineBreaker]:
      case LEXICON[Lexicon.LineBreaker2]: break;
      case LEXICON[Lexicon.TypeDefiner]:
      case LEXICON[Lexicon.ImpoDefiner]:
      case LEXICON[Lexicon.Setter]:
      case LEXICON[Lexicon.RequiredMarker]: {
        nextToken = currentToken;
        if (currentCharacter === LEXICON[Lexicon.Setter]) {
          nextToken += currentCharacter;
        }
        break;
      }
      default: {
        if (validateIdentifier(currentToken) || validateStringLiteral(currentToken)) {
          nextToken = currentToken;
        } else {
          // TODO: Throw a syntax error here.
          console.log("expected identifier");
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
    if (stringLiteralMode) {
      currentToken += character;
      if (character === LEXICON[Lexicon.StringMarker]) {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        stringLiteralMode = false;
      }
      continue;
    }
    if (
      character === LEXICON[Lexicon.LineBreaker] ||
      character === LEXICON[Lexicon.LineBreaker2]
    ) {
      breakLine(character);
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
      case LEXICON[Lexicon.RequiredMarker]: {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
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
      case LEXICON[Lexicon.Setter]: {
        nextToken = closeCurrentToken(character);
        if (nextToken !== null) yield nextToken;
        if (nextToken !== LEXICON[Lexicon.RequiredMarker] + LEXICON[Lexicon.Setter]) {
          yield character;
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
