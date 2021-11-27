import type { CodeBlock } from "../code_block/mod.ts";
import type { Token } from "../tokenize/mod.ts";
import { CartridgeEvent } from "../cartridge/mod.ts";

export const makeFileStartEventContext = (
  code: CodeBlock,
  tokens: Token[],
) => ({ type: CartridgeEvent.FileStart, code, tokens, data: null });
