import { Lexicon, Token } from "./tokenize/mod.ts";

/**
 * @todo write tests in utils.test.ts
 */
export function assertKind(
  token?: Token,
  ...validLex: Lexicon[]
): Token {
  const isValidLexeme = validLex.includes(token?.kind ?? Lexicon.Unknown);
  if (token === undefined || !isValidLexeme) {
    throw new Error(
      `Expected token kind ${validLex.join(" or ")}, but got ${token}`,
    );
  }
  return token;
}
