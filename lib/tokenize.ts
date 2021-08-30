import { Lexicon } from "./types.ts";
import { validateIdentifier, validateStringLiteral } from "./utils.ts";

export function* tokenize(
  content: string,
): Generator<string, string, undefined> {
  let currentToken = "";
  let commentMode = false;
  let stringLiteralMode = false;
  const closeCurrentToken = (
    currentCharacter: string | null = null,
  ): string | null => {
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
    return nextToken;
  };
  for (const character of content) {
    let nextToken: string | null;
    if (stringLiteralMode) {
      currentToken += character;
      if (character === Lexicon.StringLiteral) {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        stringLiteralMode = false;
      }
      continue;
    }
    if (commentMode) {
      if (character === Lexicon.LineBreaker) {
        commentMode = false;
      }
      continue;
    }
    switch (character) {
      case Lexicon.Commenter:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        commentMode = true;
        break;
      case Lexicon.StringLiteral:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        stringLiteralMode = true;
        currentToken += character;
        break;
      case Lexicon.RequiredMarker:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
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
