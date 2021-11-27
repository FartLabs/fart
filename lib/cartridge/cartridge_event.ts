import type { Token } from "../tokenize/mod.ts";

export enum CartridgeEvent {
  FileStart = "file_start",
  InlineComment = "inline_comment",
  MultilineComment = "multiline_comment",
  Load = "load",
  StructOpen = "struct_open",
  SetProperty = "set_property",
  StructClose = "struct_close",
  FileEnd = "file_end",
}

export type CartridgeEventReturnType = (
  | void
  | Promise<void>
  | string
  | Promise<string>
  | null
);

export interface CartridgeEventContext<T extends CartridgeEvent> {
  type: T;
  code: {
    append: (code: string) => CartridgeEventReturnType;
  };
  tokens: Token[];
  data: T extends CartridgeEvent.InlineComment ? { comments: string[] }
    : T extends CartridgeEvent.MultilineComment ? { comments: string[] }
    : T extends CartridgeEvent.Load ? { comments: string[] }
    : T extends CartridgeEvent.StructOpen
      ? { comments: string[]; name?: string } // undefined name implies anonymous struct
    : T extends CartridgeEvent.SetProperty
      ? { comments: string[]; name: string; value: string }
    : null;
}

/**
 * If a code generation function returns null, that means that the
 * target language omits the requested generated code. A null return
 * value will prevent the requested line from being appended to the result.
 */
export type CartridgeHandler<T extends CartridgeEvent> = (
  event: CartridgeEventContext<T>,
) => CartridgeEventReturnType;

export interface CartridgeHandlerMap {
  [CartridgeEvent.FileStart]?: CartridgeHandler<CartridgeEvent.FileStart>;
  [CartridgeEvent.InlineComment]?: CartridgeHandler<
    CartridgeEvent.InlineComment
  >;
  [CartridgeEvent.MultilineComment]?: CartridgeHandler<
    CartridgeEvent.MultilineComment
  >;
  [CartridgeEvent.Load]?: CartridgeHandler<CartridgeEvent.Load>;
  [CartridgeEvent.StructOpen]?: CartridgeHandler<CartridgeEvent.StructOpen>;
  [CartridgeEvent.SetProperty]?: CartridgeHandler<CartridgeEvent.SetProperty>;
  [CartridgeEvent.StructClose]?: CartridgeHandler<CartridgeEvent.StructClose>;
  [CartridgeEvent.FileEnd]?: CartridgeHandler<CartridgeEvent.FileEnd>;
}
