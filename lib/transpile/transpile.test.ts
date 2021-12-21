import { assertEquals } from "../../deps/std/testing.ts";
import { transpile } from "./transpile.ts";
import { Cartridge, CartridgeEvent } from "./cartridge/mod.ts";
import type { CartridgeEventContext } from "./cartridge/mod.ts";
// import type { FartOptions } from "./transpile.ts";

Deno.test("empty string results in empty string", async () => {
  const fakeCart = new Cartridge();
  fakeCart.on(
    CartridgeEvent.StructOpen,
    (event: CartridgeEventContext<CartridgeEvent.StructOpen>) => {
      assertEquals(event.data.name, "Example");
      console.log({ event });
      return "";
    },
  );
  const result = await transpile(`type Example {`, fakeCart);
  assertEquals(result, "");
});
