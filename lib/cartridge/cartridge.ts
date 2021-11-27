import { CartridgeEvent, CartridgeEventReturnType } from "./cartridge_event.ts";
import type {
  CartridgeEventContext,
  CartridgeHandler,
  CartridgeHandlerMap,
} from "./cartridge_event.ts";

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

  // TODO(@ethanthatonekid): add a `dispatch` method
  // @see <https://github.com/EthanThatOneKid/fart/blob/c43f233345/lib/gen/cart.ts#L120>
}
