import { assertEquals } from "../../deps/std/testing.ts";
import { Cartridge } from "./cartridge.ts";
import { CartridgeEvent } from "./cartridge_event.ts";
import { CodeBlock } from "../code_block/mod.ts";

/**
 * @todo @ethanthatonekid write tests that reflect cartridge api design/usage
 */
Deno.test("hello world", () => {
  const cartridge = new Cartridge();
  cartridge.on(CartridgeEvent.Load, (event) => {
    event.data;
  });
  cartridge.on(CartridgeEvent.FileStart, console.log);
  assertEquals(1, 1);
});

Deno.test("event 'file_start' makes a successful dispatch", async () => {
  const cartridge = new Cartridge();
  cartridge.on(CartridgeEvent.FileStart, (event) => {
    assertEquals(event.type, CartridgeEvent.FileStart, "matches event name");
    assertEquals(event.tokens.length, 0, "expects 0 tokens");
    assertEquals(event.data, null, "always null");
    return "ABC";
  });
  const result = await cartridge.dispatch(CartridgeEvent.FileStart, {
    type: CartridgeEvent.FileStart,
    code: new CodeBlock(),
    data: null,
    tokens: [],
  });
  assertEquals(result, "ABC");
});
