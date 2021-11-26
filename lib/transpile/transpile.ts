import { Token, tokenize } from "../tokenize/mod.ts";
import { Cartridge } from "../cartridge/mod.ts";
import { TextBuilder } from "../text_builder/mod.ts";
import type { FartTokenGenerator } from "../tokenize/mod.ts";

export interface FartOptions {
  targetLanguage: "ts" | "go" | "json" | "html";
  codeCartridges: Cartridge[];
  indentation: number;
  preserveComments: boolean;
}

interface TranspilationContext {
  tokenizer: FartTokenGenerator | null;
  builder: TextBuilder;
  prevTokens: Token[];
}

const INITIAL_TRANSPILATION_CONTEXT: TranspilationContext = Object.freeze({
  tokenizer: null,
  builder: new TextBuilder(),
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
