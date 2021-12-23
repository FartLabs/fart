import { assertEquals } from "../../deps/std/testing.ts";
import { TranspilationContext, transpile } from "./transpile.ts";
import { Cartridge, CartridgeEvent } from "./cartridge/mod.ts";
import type { CartridgeEventContext } from "./cartridge/mod.ts";
import { TextBuilder } from "./text_builder/mod.ts";
import { tokenize } from "./tokenize/mod.ts";

Deno.test("create transpilation context without crashing", () => {
  const iterator = tokenize("");
  const cartridge = new Cartridge();
  const builder = new TextBuilder(cartridge);
  const ctx = new TranspilationContext(iterator, builder);
  assertEquals(ctx.started, false);
});

// Deno.test("transpiles struct_open event", async () => {
//   const fakeCart = new Cartridge();
//   fakeCart.on(
//     CartridgeEvent.StructOpen,
//     (event: CartridgeEventContext<CartridgeEvent.StructOpen>) => {
//       assertEquals(event.data.name, "Example");
//       assertEquals(event.data.comments, []);
//       return "ABC";
//     },
//   );
//   const result = await transpile(`type Example {`, fakeCart);
//   assertEquals(result, "ABC");
// });
