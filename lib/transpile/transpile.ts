import { Lexeme, Token, tokenize } from "./tokenize/mod.ts";
import { Cartridge, CartridgeEvent } from "./cartridge/mod.ts";
import type { ModHandler, PropertyDefinition } from "./cartridge/mod.ts";
import { TextBuilder } from "./text_builder/mod.ts";
import { assertKind } from "./common/utils.ts";
import type { FartTokenGenerator } from "./tokenize/mod.ts";

export interface FartOptions {
  targetLanguage: string; // "ts" | "go"
  sourceLanguage: string; // "fart" | "fart-pb" | "fart-go"
  codeCartridge: Cartridge;
  indentation: number;
  preserveComments: boolean;
  implFile?: string;
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
    let wildToken = initialToken;

    while (mod !== undefined) {
      mods.push(mod);
      const _modSymbol = assertKind(this.nextToken(), Lexeme.Modifier);
      wildToken = this.nextToken();
      mod = this.cartridge.getMod(wildToken?.value);
    }

    switch (wildToken?.kind) {
      case Lexeme.Identifier: {
        const result = mods.reduceRight(
          (result: string, modify: ModHandler) => modify(result),
          wildToken.value,
        );
        return result;
      }

      case Lexeme.TupleOpener: {
        // Mock fallback for current test.
        break;
      }
    }
  }

  /**
   * Consumes the next struct, tuple, or value.
   */
  public async nextLiteral(currentToken?: Token): Promise<PropertyDefinition> {
    const def = {} as PropertyDefinition;
    const wildToken = currentToken ?? this.nextToken();

    switch (wildToken?.kind) {
      case Lexeme.StructOpener: {
        def.struct = await this.nextStruct();
        break;
      }

      case Lexeme.TupleOpener: {
        def.tuple = await this.nextTuple();
        break;
      }

      case Lexeme.Identifier: {
        def.value = wildToken.value;
        break;
      }

      case Lexeme.TextLiteral: {
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
      const maybeIdent = this.nextToken();
      if (!maybeIdent) break;

      // expects identifier or '}'
      const ident = assertKind(
        maybeIdent,
        Lexeme.Identifier,
        Lexeme.StructCloser,
      );

      if (ident.is(Lexeme.StructCloser)) {
        await this.builder.append(
          CartridgeEvent.StructClose,
          [ident] as [Token],
          [],
        );
        break;
      }

      // expects ':' or '?:'
      const propertyDefiner = assertKind(
        this.nextToken(),
        Lexeme.PropertyDefiner,
        Lexeme.PropertyOptionalDefiner,
      );

      // 1st token of right-hand expression (e.g. identifier, text literal, or
      // '{').
      const wildToken = await this.nextToken();

      switch (wildToken?.kind) {
        case Lexeme.StructOpener: {
          await this.builder.append(
            CartridgeEvent.StructOpen,
            [ident, propertyDefiner, wildToken],
            [],
          );
          result[ident.value] = await this.nextLiteral(wildToken);
          break;
        }

        case Lexeme.Identifier:
        case Lexeme.TextLiteral:
        case Lexeme.TupleOpener: {
          result[ident.value] = await this.nextLiteral(wildToken);
          result[ident.value].optional = propertyDefiner.is(
            Lexeme.PropertyOptionalDefiner,
          );
          await this.builder.append(
            CartridgeEvent.SetProperty,
            [ident, propertyDefiner, wildToken],
            [],
            result[ident.value],
            ident.value,
          );
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
   * Consumes a tuple structure (a list of values inside parentheses).
   */
  public async nextTuple(): Promise<PropertyDefinition["tuple"]> {
    const result: PropertyDefinition["tuple"] = [];

    while (true) {
      const token = this.nextToken();

      if (!token) break;

      if (token.kind === Lexeme.TupleCloser) {
        break;
      }

      if (token.kind === Lexeme.Separator) {
        continue;
      }

      if (token.kind === Lexeme.Identifier) {
        const def = await this.nextLiteral(token);
        result.push({ value: def });
      } else {
        throw new Error(
          `Expected identifier or tuple closer, but got ${token.value}`,
        );
      }
    }

    return result;
  }
}

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
      case Lexeme.InlineComment: {
        const comment = assertKind(token, Lexeme.InlineComment);
        await ctx.builder.append(
          CartridgeEvent.Comment,
          [comment],
          [comment],
        );
        await ctx.builder.append(
          CartridgeEvent.InlineComment,
          [comment],
          [comment],
        );
        break;
      }

      case Lexeme.MultilineComment: {
        const comment = assertKind(token, Lexeme.MultilineComment);
        await ctx.builder.append(
          CartridgeEvent.Comment,
          [comment],
          [comment],
        );
        await ctx.builder.append(
          CartridgeEvent.MultilineComment,
          [comment],
          [comment],
        );
        break;
      }

      case Lexeme.Load: {
        const loader = assertKind(token, Lexeme.Load);
        const source = assertKind(ctx.nextToken(), Lexeme.TextLiteral);
        const opener = assertKind(ctx.nextToken(), Lexeme.TupleOpener);
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

      case Lexeme.TypeDefiner: {
        const definer = assertKind(token, Lexeme.TypeDefiner);
        const ident = assertKind(ctx.nextToken(), Lexeme.Identifier);
        const opener = assertKind(ctx.nextToken(), Lexeme.StructOpener);
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
