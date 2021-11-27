import { Token, tokenize } from "../tokenize/mod.ts";
import { Cartridge } from "../cartridge/mod.ts";
import { TextBuilder } from "../text_builder/mod.ts";
import type { FartTokenGenerator } from "../tokenize/mod.ts";

export interface FartOptions {
  targetLanguage: string; // "ts" | "go"
  sourceLanguage: string; // "fart" | "fart-pb" | "fart-go"
  codeCartridges: Cartridge[];
  indentation: number;
  preserveComments: boolean;
}

interface TranspilationContext {
  tokenizer: FartTokenGenerator | null;
  builder: TextBuilder | null;
  prevTokens: Token[];
}

const INITIAL_TRANSPILATION_CONTEXT: TranspilationContext = Object.freeze({
  tokenizer: null,
  builder: null,
  prevTokens: [],
});

const initializeTranspilationContext = () => ({
  ...INITIAL_TRANSPILATION_CONTEXT,
});

export const transpile = async (
  code: string,
  options: FartOptions,
): Promise<string> => {
  const ctx = initializeTranspilationContext();
  ctx.tokenizer = tokenize(code);

  return "";
};
