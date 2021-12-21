import { Lexicon, Token, tokenize } from "./tokenize/mod.ts";
import { Cartridge, CartridgeEvent } from "./cartridge/mod.ts";
import { TextBuilder } from "./text_builder/mod.ts";
// import { Lang } from "../constants/lang.ts";
import { assertKind } from "./utils.ts";
import type { FartTokenGenerator } from "./tokenize/mod.ts";

/**
 * @todo rethink these options since the codeCart determines the
 * target language. The source language will be one of few supported
 * langs: Fart and Proto.
 */
export interface FartOptions {
  targetLanguage: string; // "ts" | "go"
  sourceLanguage: string; // "fart" | "fart-pb" | "fart-go"
  codeCartridge: Cartridge; // TODO: allow for user to pass Cartridge[]
  indentation: number;
  preserveComments: boolean;
}

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

/**
 * @todo impl options
 * - targetLanguage: string; // "ts" | "go"
 * - sourceLanguage: string; // "fart" | "fart-pb" | "fart-go"
 * - codeCartridge: Cartridge; // TODO: allow for user to pass Cartridge[]
 * - indentation: number;
 * - preserveComments: boolean;
 */
export function transpile(
  code: string,
  options: Cartridge | FartOptions,
): Promise<string> {
  // const srcLang = (options as FartOptions).sourceLanguage ?? Lang.Fart;
  // const targetLang = (options as FartOptions).sourceLanguage ?? Lang.TypeScript;
  // const indentation: number | undefined = (options as FartOptions).indentation;
  // const preserveComments = (options as FartOptions).preserveComments ?? false;
  const cartridge = options instanceof Cartridge
    ? options
    : options.codeCartridge;
  const builder = new TextBuilder(cartridge);
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
        console.log({ loader, source, opener });
        // await ctx.builder?.append(
        //   CartridgeEvent.StructOpen,
        //   [loader, source, opener],
        //   [],
        // );
        // await ctx.nextTuple();
        break;
      }

      case Lexicon.TypeDefiner: {
        const definer = assertKind(
          ctx.currentToken?.value as Token,
          Lexicon.TypeDefiner,
        );
        const ident = assertKind(ctx.nextToken(), Lexicon.Identifier);
        const opener = assertKind(ctx.nextToken(), Lexicon.StructOpener);
        console.log({ definer, ident, opener });
        // await ctx.builder?.append(
        //   CartridgeEvent.StructOpen,
        //   [definer, ident, opener],
        //   [],
        // );
        // await ctx.nextStruct();
        break;
      }
    }
  } while (!ctx.currentToken?.done);

  return Promise.resolve(ctx.builder?.export() ?? "");
}
