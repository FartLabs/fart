import { Lexicon, Token, tokenize } from "./tokenize/mod.ts";
import { Cartridge, CartridgeEvent } from "./cartridge/mod.ts";
import { TextBuilder } from "./text_builder/mod.ts";
import type { FartTokenGenerator } from "./tokenize/mod.ts";

export interface FartOptions {
  targetLanguage: string; // "ts" | "go"
  sourceLanguage: string; // "fart" | "fart-pb" | "fart-go"
  codeCartridges: Cartridge[];
  indentation: number;
  preserveComments: boolean;
}

const assertKind = (token: Token | null, lexeme: Lexicon): Token => {
  if (token === null || token.kind !== lexeme) {
    throw new Error(`Expected token kind ${lexeme}, got ${token}`);
  }
  return token;
};

class TranspilationContext {
  constructor(
    public tokenizer?: FartTokenGenerator,
    public builder?: TextBuilder,
    public currentToken: IteratorResult<Token, Token> | null = null,
    public prevTokens: Token[] = [],
  ) {}

  public nextToken(): Token | null {
    if (this.tokenizer !== undefined) {
      if (
        this.currentToken !== null &&
        this.prevTokens !== undefined &&
        this.currentToken !== undefined
      ) {
        this.prevTokens.push(this.currentToken.value);
      }
      const curr = this.tokenizer.next();
      if (curr.value !== undefined) {
        this.currentToken = curr;
        return curr.value;
      }
    }
    return null;
  }

  /**
   * @todo implement
   */
  public async nextStruct(): Promise<void> {
  }

  /**
   * @todo implement
   */
  public async nextTuple(): Promise<void> {
  }
}

export const transpile = (
  code: string,
  // options: FartOptions,
): string => {
  const builder = new TextBuilder(new Cartridge());
  const ctx = new TranspilationContext(tokenize(code), builder);
  do {
    switch (ctx.nextToken()?.kind) {
      case Lexicon.Load: {
        const loader = assertKind(
          ctx.currentToken?.value as Token,
          Lexicon.Load,
        );
        const source = assertKind(ctx.nextToken(), Lexicon.TextLiteral);
        const opener = assertKind(ctx.nextToken(), Lexicon.StructOpener);
        ctx.builder?.append(
          CartridgeEvent.StructOpen,
          [loader, source, opener],
          [],
        );
        ctx.nextTuple();
        break;
      }
      case Lexicon.TypeDefiner: {
        const definer = assertKind(
          ctx.currentToken?.value as Token,
          Lexicon.TypeDefiner,
        );
        const ident = assertKind(ctx.nextToken(), Lexicon.Identifier);
        const opener = assertKind(ctx.nextToken(), Lexicon.StructOpener);
        ctx.builder?.append(
          CartridgeEvent.StructOpen,
          [definer, ident, opener],
          [],
        );
        ctx.nextStruct();
        break;
      }
    }
  } while (!ctx.currentToken?.done);

  return ctx.builder?.export() ?? "";
};
