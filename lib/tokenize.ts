import { Lexicon } from "./types.ts";
import { validateIdentifier, validateStringLiteral } from "./utils.ts";

export function* tokenize(
  content: string,
): Generator<string, string, undefined> {
  let currentToken = "";
  let commentMode = false;
  let stringLiteralMode = false;
  const closeCurrentToken = (): string | null => {
    if (currentToken.length === 0 || commentMode) return null;
    let nextToken: string | null = null;
    switch (currentToken) {
      case Lexicon.TypeDefiner:
      case Lexicon.ImpoDefiner:
      case Lexicon.RequiredSetter:
        nextToken = currentToken;
        break;
      case Lexicon.Spacer:
      case Lexicon.LineBreaker:
        break;
      default:
        if (validateIdentifier(currentToken)) nextToken = currentToken;
        else {
          console.log("TODO: Throw a syntax error here (expected identifier)");
        }
        if (validateStringLiteral(currentToken)) nextToken = currentToken;
        else {
          console.log("TODO: Throw a syntax error here (expected identifier)");
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
      case Lexicon.Nester:
      case Lexicon.Denester:
      case Lexicon.Setter:
      case Lexicon.Separator:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        yield character;
        break;
      case Lexicon.Spacer:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        break;
      case Lexicon.LineBreaker:
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
