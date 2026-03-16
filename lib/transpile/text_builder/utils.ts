import type { CodeBlock } from "../code_block/mod.ts";
import type { Token } from "../tokenize/mod.ts";
import { Lexeme } from "../tokenize/mod.ts";
import {
  CartridgeEvent,
  CartridgeEventContext,
  PropertyDefinition,
} from "../cartridge/mod.ts";

/**
 * @param commentToken expects a comment token (Lexeme.InlineComment | Lexeme.MultilineComment)
 * @returns an array of strings, each string is a line of the comment; intended to be used in
 * conjunction with the `flatMap` method.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
 */
export const cleanComment = (commentToken: Token): string[] => {
  const trimmedCommentLines: string[] = [];
  switch (commentToken.kind) {
    case Lexeme.InlineComment: {
      const rawComment = commentToken.value;
      const lineBreakIndex = rawComment.indexOf("\n");
      const inlineCommentContent = rawComment
        .slice(0, lineBreakIndex > -1 ? lineBreakIndex : rawComment.length)
        .trim();
      trimmedCommentLines.push(inlineCommentContent);
      break;
    }
    case Lexeme.MultilineComment: {
      const rawCommentLines = commentToken.value.split("\n");
      rawCommentLines.forEach((rawCommentLine, index) => {
        const trimmed = rawCommentLine.trim();
        const isEdge = index === 0 || index === rawCommentLines.length - 1;
        if (isEdge && trimmed === "") return;
        trimmedCommentLines.push(trimmed);
      });
      break;
    }
  }
  return trimmedCommentLines;
};

export const makeFileStartEventContext = (
  code: CodeBlock,
  tokens: Token[],
): CartridgeEventContext<CartridgeEvent.FileStart> => ({
  type: CartridgeEvent.FileStart,
  code,
  tokens,
  data: null,
});

export const makeInlineCommentEventContext = (
  code: CodeBlock,
  tokens: Token[],
): CartridgeEventContext<CartridgeEvent.InlineComment> => ({
  type: CartridgeEvent.InlineComment,
  code,
  tokens,
  data: { comments: tokens.flatMap(cleanComment) },
});

export const makeMultilineCommentEventContext = (
  code: CodeBlock,
  tokens: Token[],
): CartridgeEventContext<CartridgeEvent.MultilineComment> => ({
  type: CartridgeEvent.MultilineComment,
  code,
  tokens,
  data: { comments: tokens.flatMap(cleanComment) },
});

export const makeLoadEventContext = (
  code: CodeBlock,
  tokens: Token[],
  comments: Token[],
  source: string,
  dependencies: string[],
): CartridgeEventContext<CartridgeEvent.Load> => ({
  type: CartridgeEvent.Load,
  code,
  tokens,
  data: { comments: comments.flatMap(cleanComment), source, dependencies },
});

export const makeStructOpenEventContext = (
  code: CodeBlock,
  tokens: Token[],
  comments: Token[],
  name?: string,
): CartridgeEventContext<CartridgeEvent.StructOpen> => ({
  type: CartridgeEvent.StructOpen,
  code,
  tokens,
  data: { name, comments: comments.flatMap(cleanComment) },
});

export const makeSetPropertyEventContext = (
  code: CodeBlock,
  tokens: Token[],
  comments: Token[],
  name: string,
  definition: PropertyDefinition,
): CartridgeEventContext<CartridgeEvent.SetProperty> => ({
  type: CartridgeEvent.SetProperty,
  code,
  tokens,
  data: { name, comments: comments.flatMap(cleanComment), definition },
});

export const makeStructCloseEventContext = (
  code: CodeBlock,
  tokens: Token[],
): CartridgeEventContext<CartridgeEvent.StructClose> => ({
  type: CartridgeEvent.StructClose,
  code,
  tokens,
  data: null,
});

export const makeFileEndEventContext = (
  code: CodeBlock,
  tokens: Token[],
): CartridgeEventContext<CartridgeEvent.FileEnd> => ({
  type: CartridgeEvent.FileEnd,
  code,
  tokens,
  data: null,
});
