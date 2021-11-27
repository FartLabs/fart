import { CodeBlock } from "./code_block/mod.ts";
import { Indent, IndentOption } from "../indent/mod.ts";
import { Cartridge, CartridgeEvent } from "../cartridge/mod.ts";
import { Token } from "../tokenize/mod.ts";

export class TextBuilder {
  private blocks: CodeBlock[];
  private currentBlock: CodeBlock;
  private indentLevel: number;

  constructor(private cartridge: Cartridge) {
    this.blocks = [];
    this.currentBlock = new CodeBlock();
    this.indentLevel = 0;
  }

  /**
   * @todo @ethanthatonekid complete this method
   * @see https://github.com/EthanThatOneKid/fart/blob/c43f233345/lib/gen/builder.ts#L20
   */
  // deno-lint-ignore no-unused-vars
  append(event: CartridgeEvent, tokens: Token[]): void {
    switch (event) {
      case CartridgeEvent.FileStart: {
        break;
      }
      case CartridgeEvent.InlineComment: {
        break;
      }
      case CartridgeEvent.MultilineComment: {
        break;
      }
      case CartridgeEvent.Load: {
        break;
      }
      case CartridgeEvent.StructOpen: {
        break;
      }
      case CartridgeEvent.SetProperty: {
        break;
      }
      case CartridgeEvent.StructClose: {
        break;
      }
      case CartridgeEvent.FileEnd: {
        break;
      }
    }
  }

  export(indent: IndentOption = Indent.Space2): string {
    return CodeBlock.join(indent, ...this.blocks);
  }
}
