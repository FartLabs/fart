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

export enum ReservedType {
  Omit = "_",
  Number = "number",
  String = "string",
  Boolean = "boolean",
  Default = "any",
}

export enum Modifier {
  Array = "array", // Modifies anything.
  Async = "async", // Modifies anything.
  Dictionary = "dict", // Modifies length-2 tuples.
  Function = "fn", // Modifies length-2 tuples.
}

export type CartridgeEventReturnType = (
  | void
  | Promise<void>
  | string
  | Promise<string>
  | null
);

// TODO: Refactor PropertyDefinition interface to be more strict using the
// list of possible definitions as a guide.
// Possible Property Definitions
// - example: string
// - example?: string
// - example: { nestedExample: string }
// - example: async % string; Promise<string>
// - example: fn % async % string; () => Promise<string>
// - example: fn % (a: string, async % string); (a: string) => Promise<string>
// - example: fn % (cb: fn % (async % _), number); (cb: () => Promise<void>) => number

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
 * Returns a type composed into plain text (e.g. `number`,
 * `Array<string>`, `(a: number, b: number) => number`, etc.).
 */
export type ModHandler = (...inner: string[]) => string;

/**
 * The TypeMap API is designed to delegate the generation of
 * syntax for various programming languages.
 */
export interface CartridgeTypeMap {
  [ReservedType.Omit]?: string;
  [ReservedType.Number]?: string;
  [ReservedType.String]?: string;
  [ReservedType.Boolean]?: string;
  [ReservedType.Default]?: string;

  // Modifiers are not required for all languages.
  [Modifier.Array]?: ModHandler;
  [Modifier.Async]?: ModHandler;
  [Modifier.Dictionary]?: ModHandler;
  [Modifier.Function]?: ModHandler;
}

export class Cartridge {
  constructor(
    private typemap: CartridgeTypeMap = {},
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

  /** `on` is an alias for `addEventListener` */
  public on = this.addEventListener.bind(this);

  public removeEventListener(name: CartridgeEvent) {
    delete this.handlers[name];
  }

  public async dispatch<T extends CartridgeEvent>(
    name: CartridgeEvent,
    ctx: CartridgeEventContext<T>,
  ): Promise<string | null> {
    const handleEvent = this.handlers[name] as CartridgeHandler<T>;
    if (handleEvent === undefined) return null;
    const executionResult = handleEvent(ctx);
    if (executionResult instanceof Promise) {
      return (await executionResult) ?? null;
    }
    return executionResult ?? null;
  }

  public getType(type?: string): string | undefined {
    return this.typemap[type as ReservedType];
  }

  public getMod(mod?: string): ModHandler | undefined {
    return this.typemap[mod as Modifier];
  }
}
