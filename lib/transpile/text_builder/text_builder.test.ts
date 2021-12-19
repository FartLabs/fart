import { assertEquals } from "../../../deps/std/testing.ts";
import { TextBuilder } from "./text_builder.ts";
import { Cartridge } from "../cartridge/mod.ts";

Deno.test("text builder exports an empty string when nothing is appended", () => {
  const cartridge = new Cartridge();
  const builder = new TextBuilder(cartridge);
  assertEquals(builder.export(), "");
});
