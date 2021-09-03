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
      case Lexicon.StringLiteral: {
        const clean = (stringLiteral: string) =>{
          const marker = LEXICON[Lexicon.StringMarker];
          const pattern = new RegExp(`^\\${marker}|\\${marker}$`, 'g')
          stringLiteral.replace(pattern, "");
        };
        return clean(this.raw);
      }
      case Lexicon.Identifier: return this.raw;
      default: return LEXICON[this.kind];
    }
  }
  
  static getKindOf(raw: string): Lexicon | null {
    switch (raw) {
      case LEXICON[Lexicon.Nester]: return Lexicon.Neser;
      case LEXICON[Lexicon.Denester]: return Lexicon.Denester;
      case LEXICON[Lexicon.OpeningAngle]: return Lexicon.OpeningAngle;
      case LEXICON[Lexicon.ClosingAngle]: return Lexicon.ClosingAngle;
      case LEXICON[Lexicon.Setter]: return Lexicon.Setter;
      case LEXICON[Lexicon.RequiredMarker]: return Lexicon.RequiredMarker;
      case LEXICON[Lexicon.TypeDefiner]: return Lexicon.TypeDefiner;
      case LEXICON[Lexicon.DepoDefiner]: return Lexicon.DepoDefiner;
      case LEXICON[Lexicon.ImpoDefiner]: return Lexicon.ImpoDefiner;
      case LEXICON[Lexicon.Commenter]: return Lexicon.Commenter;
      case LEXICON[Lexicon.Seperator]: return Lexicon.Seperator;
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
  const breakLine = (breaker: LEXICON[Lexicon.LineBreaker] | LEXICON[Lexicon.LineBreaker2]) => {
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
      case Lexicon.TypeDefiner:
      case Lexicon.ImpoDefiner:
      case Lexicon.Setter:
      case Lexicon.RequiredMarker:
        nextToken = currentToken;
        if (currentCharacter === Lexicon.Setter) {
          nextToken += currentCharacter;
        }
        break;
      case Lexicon.Spacer:
      case Lexicon.LineBreaker:
        break;
      default:
        if (validateIdentifier(currentToken)) nextToken = currentToken;
        else if (validateStringLiteral(currentToken)) nextToken = currentToken;
        else {
          // TODO: Throw a syntax error here.
          console.log("expected identifier");
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
      if (character === Lexicon.StringLiteral) {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        stringLiteralMode = false;
      }
      continue;
    }
    if (character === Lexicon.LineBreaker || character.LineBreaker2) {
      breakLine(character);
      continue;
    }
    switch (character) {
      case Lexicon.Commenter:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield makeToken(nextToken);
        commentMode = true;
        break;
      case Lexicon.StringLiteral:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield makeToken(nextToken);
        stringLiteralMode = true;
        currentToken += character;
        break;
      case Lexicon.RequiredMarker:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield makeToken(nextToken);
        currentToken += character;
        break;
      case Lexicon.Nester:
      case Lexicon.Denester:
      case Lexicon.OpeningAngle:
      case Lexicon.ClosingAngle:
      case Lexicon.Separator:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        yield character;
        break;
      case Lexicon.Setter:
        nextToken = closeCurrentToken(character);
        if (nextToken !== null) yield nextToken;
        if (nextToken !== Lexicon.RequiredMarker + Lexicon.Setter) {
          yield character;
        }
        break;
      case Lexicon.Spacer:
      case Lexicon.LineBreaker:
      case Lexicon.LineBreaker2:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        break;
      default:
        if (!commentMode) currentToken += character;
        break;
    }
  }
  return Lexicon.EOF;
}
