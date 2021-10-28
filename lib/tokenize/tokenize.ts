import { LEXICON, Lexicon } from "../consts/lexicon.ts";
import { validateIdentifier, validateStringLiteral } from "./common.ts";
import { Token } from "./token.ts";

export function* tokenize(
  content: string,
  omitComments = false,
): Generator<Token, Token, undefined> {
  let currentToken = "";
  let currentComment: string | undefined;
  let currentCommentColumn = -1;
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
  const closeCurrentToken = (
    currentCharacter: string | null = null,
  ): Token | null => {
    if (currentToken.length === 0 || currentComment !== undefined) return null;
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
  const checkForComment = (): Token | null => {
    if (currentComment !== undefined && !omitComments) {
      const cleanedComment = currentComment.trim();
      const commentToken = new Token(
        cleanedComment,
        lineCount,
        currentCommentColumn,
      );
      return commentToken;
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
      const nextComment = checkForComment();
      if (nextComment !== null) yield nextComment;
      currentComment = undefined;
      currentCommentColumn = -1;
      lineCount++;
      columnCount = 0;
    }
    // Comment mode is activated when the variable `currentComment` is not undefined.
    if (currentComment !== undefined) {
      currentComment += character;
      continue;
    }
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
        currentCommentColumn = columnCount;
        currentComment = "";
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
        currentToken += character;
        break;
      }
    }
  }
  return makeToken(LEXICON[Lexicon.EOF]);
}
