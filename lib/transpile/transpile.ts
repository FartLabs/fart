import { Lexicon, Token, tokenize } from "./tokenize/mod.ts";
import { Cartridge, CartridgeEvent } from "./cartridge/mod.ts";
import type { ModHandler, PropertyDefinition } from "./cartridge/mod.ts";
import { TextBuilder } from "./text_builder/mod.ts";
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

export class TranspilationContext {
  public started = false;
  public done = false;
  public prevTokens: Token[] = [];
  public builder: TextBuilder;

  constructor(
    public tokenizer: FartTokenGenerator,
    public cartridge: Cartridge,
  ) {
    this.builder = new TextBuilder(cartridge);
  }

  public nextToken(): Token | undefined {
    if (this.done) return undefined;
    this.started = true;
    const curr = this.tokenizer.next();
    if (curr.done) this.done = true;
    return curr.value;
  }

  public nextMod(currentToken?: Token): PropertyDefinition["value"] {
    const initialToken = currentToken ?? this.nextToken();
    const mods: ModHandler[] = [];
    let mod = this.cartridge.getMod(initialToken?.value);
    while (mod !== undefined) {
      mods.push(mod);
      const modSymbol = assertKind(this.nextToken(), Lexicon.Modifier);
      const wildToken = this.nextToken();

      switch (wildToken?.kind) {
        case Lexicon.Identifier: {
          const result = mods.reduceRight(
            (result: string, modify: ModHandler) => modify(result),
            wildToken.value,
          );
          return result;
        }

        case Lexicon.TupleOpener: {
          const results = this.nextTuple();
          break;
        }
      }
      mod = this.cartridge.getMod(this.nextToken()?.value);
    }
  }

  // public computeMods(
  //   tokens: Token[],
  //   ...mods: ModHandler[]
  // ): string | undefined {
  //   return mods.reduceRight(
  //     (result: string[], mod: ModHandler) => [mod(...result)],
  //     tokens.map(({ value }) => this.cartridge.getType(value) ?? value),
  //   ).pop();
  // }

  /**
   * Consumes the next struct, tuple, or value.
   */
  public async nextLiteral(currentToken?: Token): Promise<PropertyDefinition> {
    const def: PropertyDefinition = {};
    const wildToken = currentToken ?? this.nextToken();

    switch (wildToken?.kind) {
      case Lexicon.StructOpener: {
        def.struct = await this.nextStruct();
        break;
      }

      case Lexicon.TupleOpener: {
        def.tuple = await this.nextTuple();
        break;
      }

      case Lexicon.Identifier: {
        // const modifier = await this.nextModifier(wildToken);
        // if (modifier !== undefined) {
        // if ident is known modifier, await nextModifier();
        // }

        def.value = wildToken.value;
        break;
      }

      case Lexicon.TextLiteral: {
        def.value = wildToken.value;
        break;
      }

      default: {
        const errMessage =
          `Expected struct opener, tuple opener, or type value, but got '${wildToken}'`;
        throw new Error(errMessage);
      }
    }

    return def;
  }

  public async nextStruct(): Promise<PropertyDefinition["struct"]> {
    const result: PropertyDefinition["struct"] = {};

    while (true) {
      // expects identifier or '}'
      const ident = assertKind(
        this.nextToken(),
        Lexicon.Identifier,
        Lexicon.StructCloser,
      );

      if (ident.is(Lexicon.StructCloser)) {
        break;
      }

      // expects ':' or '?:'
      const propertyDefiner = assertKind(
        this.nextToken(),
        Lexicon.PropertyDefiner,
        Lexicon.PropertyOptionalDefiner,
      );

      // 1st token of right-hand expression (e.g. identifier, text literal, or
      // '{').
      const wildToken = await this.nextToken();

      switch (wildToken?.kind) {
        case Lexicon.StructOpener: {
          await this.builder.append(
            CartridgeEvent.StructOpen,
            [ident, propertyDefiner, wildToken],
            [],
          );
          result[ident.value] = await this.nextLiteral(wildToken);
          break;
        }

        case Lexicon.Identifier:
        case Lexicon.TextLiteral: {
          result[ident.value] = await this.nextLiteral(wildToken);
          break;
        }

        default: {
          throw new Error(
            `Expected struct opener or type value, but got ${wildToken}`,
          );
        }
      }
    }

    return result;
  }

  /**
   * @todo implement
   */
  public nextTuple(): PropertyDefinition["tuple"] {
    return [];
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
export async function transpile(
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
  const ctx = new TranspilationContext(tokenize(code), cartridge);

  // dispatch the file_start event at the start of the transpilation
  await ctx.builder.append(CartridgeEvent.FileStart);

  for (let token = ctx.nextToken(); !ctx.done; token = ctx.nextToken()) {
    switch (token?.kind) {
      case Lexicon.InlineComment: {
        const comment = assertKind(token, Lexicon.InlineComment);
        await ctx.builder.append(
          CartridgeEvent.InlineComment,
          [comment],
          [comment],
        );
        break;
      }

      case Lexicon.MultilineComment: {
        const comment = assertKind(token, Lexicon.MultilineComment);
        await ctx.builder.append(
          CartridgeEvent.MultilineComment,
          [comment],
          [comment],
        );
        break;
      }

      case Lexicon.Load: {
        const loader = assertKind(token, Lexicon.Load);
        const source = assertKind(ctx.nextToken(), Lexicon.TextLiteral);
        const opener = assertKind(ctx.nextToken(), Lexicon.TupleOpener);
        const tuple = await ctx.nextTuple();
        if (tuple === undefined) throw new Error("Expected tuple");
        const dependencies = tuple
          .filter(({ value: def }) => typeof def.value === "string")
          .map(({ value: def }) => def.value as string);
        await ctx.builder.append(
          CartridgeEvent.Load,
          [loader, source, opener],
          [],
          undefined,
          source.value,
          ...dependencies,
        );
        break;
      }

      case Lexicon.TypeDefiner: {
        const definer = assertKind(token, Lexicon.TypeDefiner);
        const ident = assertKind(ctx.nextToken(), Lexicon.Identifier);
        const opener = assertKind(ctx.nextToken(), Lexicon.StructOpener);
        await ctx.builder.append(
          CartridgeEvent.StructOpen,
          [definer, ident, opener],
          /* comments=*/ [],
          { value: ident.value }, // pass struct name to builder
        );
        await ctx.nextStruct();
        break;
      }
    }
  }

  // dispatch the file_end event at the end of the transpilation
  await ctx.builder.append(CartridgeEvent.FileEnd);

  return ctx.builder.export();
}
