import { FartGrammar } from "./types.ts";
import { validateIdentifier } from "./utils.ts";

export function* tokenize(content: string) {
  let currentToken = "";
  let commentMode = false;
  const closeCurrentToken = (): string | null => {
    if (currentToken.length === 0 || commentMode) return null;
    let nextToken: string | null = null;
    switch (currentToken) {
      case FartGrammar.TypeDefiner:
      case FartGrammar.DepoDefiner:
      case FartGrammar.ConstSetter:
      case FartGrammar.RequiredSetter:
        nextToken = currentToken;
        break;
      case FartGrammar.Spacer:
      case FartGrammar.LineBreaker:
        break;
      default:
        if (validateIdentifier(currentToken)) nextToken = currentToken;
        else {
          console.log("TODO: Throw a syntax error here (expected identifier)");
        }
    }
    currentToken = "";
    return nextToken;
  };
  for (const character of content) {
    let nextToken: string | null;
    switch (character) {
      case FartGrammar.Commenter:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        commentMode = true;
        break;
      case FartGrammar.Nester:
      case FartGrammar.Denester:
      case FartGrammar.Setter:
      case FartGrammar.Seperator:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        yield character;
        break;
      case FartGrammar.Spacer:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        break;
      case FartGrammar.LineBreaker:
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        commentMode = false;
        break;
      default:
        if (!commentMode) currentToken += character;
        break;
    }
  }
  return;
}
