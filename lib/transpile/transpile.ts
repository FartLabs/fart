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
  currentToken: Token | null;
  nextToken: () => Token | undefined;
  nextStruct: () => Promise<void>;
  nextTuple: () => Promise<void>;
}

const INITIAL_TRANSPILATION_CONTEXT: TranspilationContext = {
  tokenizer: null,
  builder: null,
  prevTokens: [],
  currentToken: null,
  nextToken() {
    if (this.tokenizer !== null) {
      if (this.currentToken !== null) {
        this.prevTokens.push(this.currentToken);
      }
      return this.tokenizer.next().value;
    }
  },
  async nextStruct() {
    // TODO: handle struct
  },
  async nextTuple() {
    // TODO: handle tuple
  },
};

const initializeTranspilationContext = () => ({
  ...INITIAL_TRANSPILATION_CONTEXT,
});

export const transpile = (
  code: string,
  // options: FartOptions,
): string => {
  const ctx = initializeTranspilationContext();
  ctx.tokenizer = tokenize(code);

  return "";
};
