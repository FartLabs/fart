import { Lexeme, Token } from "../tokenize/mod.ts";

export function assertKind(
  token?: Token,
  ...validLex: Lexeme[]
): Token {
  const isValidLexeme = validLex.includes(token?.kind ?? Lexeme.Unknown);
  if (token === undefined || !isValidLexeme) {
    throw new Error(
      `Expected token kind ${validLex.join(" or ")}, but got ${token}`,
    );
  }
  return token;
}
