import { LEXICON, Lexicon } from "../consts/lexicon.ts";
import { validateIdentifier, validateStringLiteral } from "./common.ts";
import { Token } from "./token.ts";

export function* tokenize(
  content: string,
): Generator<Token, Token, undefined> {
  let currentToken = "";
  let commentMode = false;
  let stringLiteralMode:
    | Lexicon.StringMarker
    | Lexicon.StringMarker2
    | Lexicon.StringMarker3
    | null = null;
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
      case LEXICON[Lexicon.LoadDefiner]:
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
    if (stringLiteralMode !== null) {
      currentToken += character;
      if (character === LEXICON[stringLiteralMode]) {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        stringLiteralMode = null;
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
        stringLiteralMode = Lexicon.StringMarker;
        currentToken += character;
        break;
      }
      case LEXICON[Lexicon.StringMarker2]: {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        stringLiteralMode = Lexicon.StringMarker2;
        currentToken += character;
        break;
      }
      case LEXICON[Lexicon.StringMarker3]: {
        nextToken = closeCurrentToken();
        if (nextToken !== null) yield nextToken;
        stringLiteralMode = Lexicon.StringMarker3;
        currentToken += character;
        break;
      }
      case LEXICON[Lexicon.Nester]:
      case LEXICON[Lexicon.Denester]:
      case LEXICON[Lexicon.OpeningAngle]:
      case LEXICON[Lexicon.ClosingAngle]:
      case LEXICON[Lexicon.Modifier]:
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
