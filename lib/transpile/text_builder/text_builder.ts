import { CodeBlock } from "../code_block/mod.ts";
import { Indent, IndentOption } from "../indent/mod.ts";
import {
  Cartridge,
  CartridgeEvent,
  PropertyDefinition,
} from "../cartridge/mod.ts";
import type { Token } from "../tokenize/mod.ts";
import {
  makeFileEndEventContext,
  makeFileStartEventContext,
  makeInlineCommentEventContext,
  makeLoadEventContext,
  makeMultilineCommentEventContext,
  makeSetPropertyEventContext,
  makeStructCloseEventContext,
  makeStructOpenEventContext,
} from "./utils.ts";
// import { assertKind } from "../utils.ts";

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
   * _stash_ away the current code block into the list of
   * code blocks ready to be exported.
   */
  private stash() {
    if (this.currentBlock.code.length > 0) {
      this.blocks.push(this.currentBlock);
      this.currentBlock = new CodeBlock();
    }
  }

  public async append(
    event: CartridgeEvent.FileStart,
    tokens?: Token[],
    comments?: Token[],
  ): Promise<void>;
  public async append(
    event: CartridgeEvent.InlineComment,
    tokens: [Token],
    comments: Token[],
  ): Promise<void>;
  public async append(
    event: CartridgeEvent.MultilineComment,
    tokens: [Token],
    comments: Token[],
  ): Promise<void>;
  public async append(
    event: CartridgeEvent.Load,
    tokens: Token[],
    comments: Token[],
    value: undefined,
    source: string,
    ...dependencies: string[]
  ): Promise<void>;
  public async append(
    event: CartridgeEvent.StructOpen,
    tokens: Token[],
    comments: Token[],
    value?: PropertyDefinition,
  ): Promise<void>;
  public async append(
    event: CartridgeEvent.SetProperty,
    tokens: Token[],
    comments: Token[],
  ): Promise<void>;
  public async append(
    event: CartridgeEvent.StructClose,
    tokens: [Token],
    comments: Token[],
  ): Promise<void>;
  public async append(
    event: CartridgeEvent.FileEnd,
    tokens: Token[],
    comments: Token[],
  ): Promise<void>;
  public async append(
    event: CartridgeEvent,
    tokens: Token[] = [],
    comments: Token[] = [],
    value?: PropertyDefinition,
    ...rest: string[]
  ): Promise<void> {
    let code: string | void | null;

    switch (event) {
      case CartridgeEvent.FileStart: {
        code = await this.cartridge.dispatch(
          CartridgeEvent.FileStart,
          makeFileStartEventContext(this.currentBlock, tokens),
        );
        break;
      }

      case CartridgeEvent.InlineComment: {
        code = await this.cartridge.dispatch(
          CartridgeEvent.InlineComment,
          makeInlineCommentEventContext(this.currentBlock, tokens),
        );
        break;
      }

      case CartridgeEvent.MultilineComment: {
        code = await this.cartridge.dispatch(
          CartridgeEvent.MultilineComment,
          makeMultilineCommentEventContext(this.currentBlock, tokens),
        );
        break;
      }

      case CartridgeEvent.Load: {
        const [source, ...dependencies] = rest;
        code = await this.cartridge.dispatch(
          CartridgeEvent.Load,
          makeLoadEventContext(
            this.currentBlock,
            tokens,
            comments,
            source,
            dependencies,
          ),
        );
        break;
      }

      case CartridgeEvent.StructOpen: {
        code = await this.cartridge.dispatch(
          CartridgeEvent.StructOpen,
          makeStructOpenEventContext(
            this.currentBlock,
            tokens,
            comments,
            value?.value,
          ),
        );
        this.indentLevel++;
        break;
      }

      case CartridgeEvent.SetProperty: {
        const [name] = rest;
        code = await this.cartridge.dispatch(
          CartridgeEvent.SetProperty,
          makeSetPropertyEventContext(
            this.currentBlock,
            tokens,
            comments,
            name,
            value as PropertyDefinition,
          ),
        );
        break;
      }

      case CartridgeEvent.StructClose: {
        if (--this.indentLevel === 0) this.stash();
        code = await this.cartridge.dispatch(
          CartridgeEvent.StructClose,
          makeStructCloseEventContext(this.currentBlock, tokens),
        );
        break;
      }

      case CartridgeEvent.FileEnd: {
        code = await this.cartridge.dispatch(
          CartridgeEvent.FileEnd,
          makeFileEndEventContext(this.currentBlock, tokens),
        );
        break;
      }
    }

    if (typeof code === "string") {
      this.currentBlock.append(code);
    }
  }

  export(indent: IndentOption = Indent.Space2): string {
    this.stash();
    return CodeBlock.join(indent, ...this.blocks);
  }
}
