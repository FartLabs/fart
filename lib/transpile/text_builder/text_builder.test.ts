import { assertEquals } from "../../../deps/std/testing.ts";
import { TextBuilder } from "./text_builder.ts";
import { Cartridge, CartridgeEvent } from "../cartridge/mod.ts";
import { T } from "../tokenize/mod.ts";

Deno.test("text builder exports an empty string when nothing is appended", () => {
  const cartridge = new Cartridge();
  const builder = new TextBuilder(cartridge);
  assertEquals(builder.export(), "");
});

Deno.test("text builder appends file_start event", async () => {
  const cartridge = new Cartridge();
  cartridge.on(CartridgeEvent.FileStart, () => "ABC");
  const builder = new TextBuilder(cartridge);
  await builder.append(CartridgeEvent.FileStart);
  assertEquals(builder.export(), "ABC");
});

Deno.test("text builder appends inline_comment event", async () => {
  const cartridge = new Cartridge();
  cartridge.on(CartridgeEvent.InlineComment, () => "ABC");
  const builder = new TextBuilder(cartridge);
  await builder.append(
    CartridgeEvent.InlineComment,
    [T.comment("; Example", 1, 1)],
    [],
  );
  assertEquals(builder.export(), "ABC");
});

Deno.test("text builder appends multiline_comment event", async () => {
  const cartridge = new Cartridge();
  cartridge.on(CartridgeEvent.MultilineComment, () => "ABC");
  const builder = new TextBuilder(cartridge);
  await builder.append(
    CartridgeEvent.MultilineComment,
    [T.multiline_comment(
      `/*
  This is a multiline comment!
*/`,
      1,
      1,
    )],
    [],
  );
  assertEquals(builder.export(), "ABC");
});

Deno.test("text builder appends load event", async () => {
  const cartridge = new Cartridge();
  cartridge.on(CartridgeEvent.Load, () => "ABC");
  const builder = new TextBuilder(cartridge);
  await builder.append(
    CartridgeEvent.Load,
    /* tokens=*/ [],
    /* comments=*/ [],
    /* always undefined=*/ undefined,
    /* src=*/ "",
    /* dep1=*/ "",
  );
  assertEquals(builder.export(), "ABC");
});

Deno.test("text builder appends struct_open event", async () => {
  const cartridge = new Cartridge();
  cartridge.on(CartridgeEvent.StructOpen, () => "ABC");
  const builder = new TextBuilder(cartridge);
  await builder.append(CartridgeEvent.StructOpen, [], []);
  assertEquals(builder.export(), "ABC");
});

Deno.test("text builder appends set_property event", async () => {
  const cartridge = new Cartridge();
  cartridge.on(CartridgeEvent.SetProperty, () => "ABC");
  const builder = new TextBuilder(cartridge);
  await builder.append(CartridgeEvent.SetProperty, [], []);
  assertEquals(builder.export(), "ABC");
});

Deno.test("text builder appends struct_close event", async () => {
  const cartridge = new Cartridge();
  cartridge.on(CartridgeEvent.StructClose, () => "ABC");
  const builder = new TextBuilder(cartridge);
  await builder.append(
    CartridgeEvent.StructClose,
    [T.denest(1, 1)],
    [],
  );
  assertEquals(builder.export(), "ABC");
});

Deno.test("text builder appends file_end event", async () => {
  const cartridge = new Cartridge();
  cartridge.on(CartridgeEvent.FileEnd, () => "ABC");
  const builder = new TextBuilder(cartridge);
  await builder.append(CartridgeEvent.FileEnd, [], []);
  assertEquals(builder.export(), "ABC");
});
