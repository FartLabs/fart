import { CodeBlock } from "../code_block/mod.ts";
import { Indent, IndentOption } from "../indent/mod.ts";
import {
  Cartridge,
  CartridgeEvent,
  PropertyDefinition,
} from "../cartridge/mod.ts";
import { Lexicon } from "../tokenize/mod.ts";
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
import { assertKind } from "../utils.ts";

export class TextBuilder {
  private blocks: CodeBlock[];
  private currentBlock: CodeBlock;
  private indentLevel: number;
  constructor(private cartridge: Cartridge) {
    this.blocks = [];
    this.currentBlock = new CodeBlock();
    this.indentLevel = 0;
  }

  public async append(
    event: CartridgeEvent.FileStart,
    tokens: Token[],
    comments: Token[],
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
    tokens: Token[],
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
        const { value: name } = assertKind(tokens[1], Lexicon.Identifier);
        code = await this.cartridge.dispatch(
          CartridgeEvent.StructOpen,
          makeStructOpenEventContext(this.currentBlock, tokens, comments, name),
        );
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
        code = await this.cartridge.dispatch(
          CartridgeEvent.StructOpen,
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
    return CodeBlock.join(indent, ...this.blocks);
  }
}
