import { Token, tokenize } from "./tokenize/mod.ts";
import { Cartridge } from "./cartridge/mod.ts";
import { TextBuilder } from "./text_builder/mod.ts";
import type { FartTokenGenerator } from "./tokenize/mod.ts";

export interface FartOptions {
  targetLanguage: string; // "ts" | "go"
  sourceLanguage: string; // "fart" | "fart-pb" | "fart-go"
  codeCartridges: Cartridge[];
  indentation: number;
  preserveComments: boolean;
}

class TranspilationContext {
  constructor(
    public tokenizer?: FartTokenGenerator,
    public builder?: TextBuilder,
    public currentToken: Token | null = null,
    public prevTokens: Token[] = [],
  ) {}

  public nextToken(): Token | null {
    if (this.tokenizer !== undefined) {
      if (
        this.currentToken !== null &&
        this.prevTokens !== undefined &&
        this.currentToken !== undefined
      ) {
        this.prevTokens.push(this.currentToken);
      }
      const token = this.tokenizer.next().value;
      if (token !== undefined) {
        return this.currentToken = token;
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
  const ctx = new TranspilationContext(
    tokenize(code),
    new TextBuilder(new Cartridge()),
  );
  console.log({ ctx });
  return "";
};
