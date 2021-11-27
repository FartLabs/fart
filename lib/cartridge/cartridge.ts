import { CartridgeEvent } from "./cartridge_event.ts";
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

  addEventListener(
    name: CartridgeEvent.FileStart,
    handler: CartridgeHandler<CartridgeEvent.FileStart>,
  ): void;
  addEventListener(
    name: CartridgeEvent.InlineComment,
    handler: CartridgeHandler<CartridgeEvent.InlineComment>,
  ): void;
  addEventListener(
    name: CartridgeEvent.MultilineComment,
    handler: CartridgeHandler<CartridgeEvent.MultilineComment>,
  ): void;
  addEventListener(
    name: CartridgeEvent.Load,
    handler: CartridgeHandler<CartridgeEvent.Load>,
  ): void;
  addEventListener(
    name: CartridgeEvent.StructOpen,
    handler: CartridgeHandler<CartridgeEvent.StructOpen>,
  ): void;
  addEventListener(
    name: CartridgeEvent.SetProperty,
    handler: CartridgeHandler<CartridgeEvent.StructClose>,
  ): void;
  addEventListener(
    name: CartridgeEvent.FileEnd,
    handler: CartridgeHandler<CartridgeEvent.FileEnd>,
  ): void;
  addEventListener(
    name: CartridgeEvent,
    // deno-lint-ignore no-explicit-any
    handler: any,
  ) {
    this.handlers[name] = handler;
  }

  /**
   * `on` is an alias for `addEventListener`
   */
  on = this.addEventListener.bind(this);

  removeEventListener(name: CartridgeEvent) {
    delete this.handlers[name];
  }

  // TODO(@ethanthatonekid): add a `dispatch` method
  // @see <https://github.com/EthanThatOneKid/fart/blob/c43f233345/lib/gen/cart.ts#L120>
}
