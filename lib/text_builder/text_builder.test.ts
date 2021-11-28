import { assertEquals } from "../../deps/std/testing.ts";
import { TextBuilder } from "./text_builder.ts";
import { Cartridge } from "../cartridge/mod.ts";

const dummy = new Cartridge();

Deno.test("text builder exports an empty string when nothing is appended", () => {
  const builder = new TextBuilder(dummy);
  assertEquals(builder.export(), "");
});
