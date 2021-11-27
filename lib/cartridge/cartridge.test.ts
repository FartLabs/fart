import { assertEquals } from "../../deps/std/testing.ts";
import { Cartridge } from "./cartridge.ts";
import { CartridgeEvent } from "./cartridge_event.ts";

/**
 * @todo @ethanthatonekid write tests that reflect cartridge api design/usage
 */
Deno.test("hello world", () => {
  const cartridge = new Cartridge();
  cartridge.on(CartridgeEvent.FileStart, console.log);
  assertEquals(1, 1);
});
