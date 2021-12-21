import { Lexicon, Token } from "./tokenize/mod.ts";

/**
 * @todo write tests in utils.test.ts
 */
export function assertKind(token: Token | null, lexeme: Lexicon): Token {
  if (token === null || token.kind !== lexeme) {
    throw new Error(
      `Expected token kind ${Lexicon[lexeme]}, got ${token}`,
    );
  }
  return token;
}
