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

export interface PropertyDefinition {
  optional?: boolean;
  modifier?: string;
  struct?: Record<string, PropertyDefinition>;
  tuple?: Array<{
    label?: string;
    value: PropertyDefinition;
  }>;
  value?: string;
}

export interface CartridgeEventContext<T extends CartridgeEvent> {
  type: T;
  code: { append: (code: string) => CartridgeEventReturnType };
  tokens: Token[];
  data: T extends CartridgeEvent.InlineComment ? { comments: string[] }
    : T extends CartridgeEvent.MultilineComment ? { comments: string[] }
    : T extends CartridgeEvent.Load
      ? { comments: string[]; dependencies: string[]; source: string }
    : T extends CartridgeEvent.StructOpen
      ? { comments: string[]; name?: string } // undefined name implies anonymous struct
    : T extends CartridgeEvent.SetProperty ? ({
      comments: string[];
      name: string;
      definition: PropertyDefinition;
    })
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

/**
 * @todo @ethanthatonekid pass all tests in ./cartridge.test.ts
 * @todo @ethanthatonekid refactor <https://github.com/EthanThatOneKid/fart/blob/c43f2333458b2cbc40d167610d87e2a2e3f89885/lib/gen/cart.ts>
 */
export class Cartridge {
  constructor(
    private handlers: CartridgeHandlerMap = {},
  ) {}

  public addEventListener(
    name: CartridgeEvent.FileStart,
    handler: CartridgeHandler<CartridgeEvent.FileStart>,
  ): void;
  public addEventListener(
    name: CartridgeEvent.InlineComment,
    handler: CartridgeHandler<CartridgeEvent.InlineComment>,
  ): void;
  public addEventListener(
    name: CartridgeEvent.MultilineComment,
    handler: CartridgeHandler<CartridgeEvent.MultilineComment>,
  ): void;
  public addEventListener(
    name: CartridgeEvent.Load,
    handler: CartridgeHandler<CartridgeEvent.Load>,
  ): void;
  public addEventListener(
    name: CartridgeEvent.StructOpen,
    handler: CartridgeHandler<CartridgeEvent.StructOpen>,
  ): void;
  public addEventListener(
    name: CartridgeEvent.SetProperty,
    handler: CartridgeHandler<CartridgeEvent.SetProperty>,
  ): void;
  public addEventListener(
    name: CartridgeEvent.StructClose,
    handler: CartridgeHandler<CartridgeEvent.StructClose>,
  ): void;
  public addEventListener(
    name: CartridgeEvent.FileEnd,
    handler: CartridgeHandler<CartridgeEvent.FileEnd>,
  ): void;
  public addEventListener(
    name: CartridgeEvent,
    // deno-lint-ignore no-explicit-any
    handler: any,
  ) {
    this.handlers[name] = handler;
  }

  /**
   * `on` is an alias for `addEventListener`
   */
  public on = this.addEventListener.bind(this);

  public removeEventListener(name: CartridgeEvent) {
    delete this.handlers[name];
  }

  public async dispatch<T extends CartridgeEvent>(
    name: CartridgeEvent,
    ctx: CartridgeEventContext<T>,
  ): Promise<string | null | void> {
    const handleEvent = this.handlers[name] as CartridgeHandler<T>;
    if (handleEvent === undefined) return null;
    const executionResult = handleEvent(ctx);
    return executionResult instanceof Promise
      ? await executionResult
      : executionResult;
  }
}
