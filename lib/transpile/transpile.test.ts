import { assertEquals } from "@std/assert";
import { TranspilationContext, transpile } from "./transpile.ts";
import { Cartridge, CartridgeEvent } from "./cartridge/mod.ts";
import type { CartridgeEventContext } from "./cartridge/mod.ts";
import { type CartridgeTypeMap, Modifier } from "./cartridge/cartridge.ts";
import { tokenize } from "./tokenize/mod.ts";

Deno.test("create transpilation context without crashing", () => {
  const iterator = tokenize("");
  const cartridge = new Cartridge();
  const ctx = new TranspilationContext(iterator, cartridge);
  assertEquals(ctx.started, false);
});

Deno.test("empty input only fires file_start event and then file_end event", async () => {
  const fakeCart = new Cartridge();
  fakeCart.on(CartridgeEvent.FileStart, () => "ABC");
  fakeCart.on(CartridgeEvent.FileEnd, () => "XYZ");
  const result = await transpile("", fakeCart);
  assertEquals(result, "ABC\n\nXYZ");
});

Deno.test("transpiles inline_comment event", async () => {
  const fakeCart = new Cartridge();
  fakeCart.on(
    CartridgeEvent.InlineComment,
    (event: CartridgeEventContext<CartridgeEvent.InlineComment>) => {
      assertEquals(event.data.comments, ["hello world"]);
      return "ABC";
    },
  );
  const result = await transpile("; hello world", fakeCart);
  assertEquals(result, "ABC");
});

Deno.test("transpiles multiline_comment event", async () => {
  const fakeCart = new Cartridge();
  fakeCart.on(
    CartridgeEvent.MultilineComment,
    (event: CartridgeEventContext<CartridgeEvent.MultilineComment>) => {
      assertEquals(event.data.comments, ["example"]);
      return "ABC";
    },
  );
  const result = await transpile(
    `/*
  example
*/`,
    fakeCart,
  );
  assertEquals(result, "ABC");
});

Deno.test("transpiles load event", async () => {
  const fakeCart = new Cartridge();
  fakeCart.on(
    CartridgeEvent.Load,
    (event: CartridgeEventContext<CartridgeEvent.Load>) => {
      assertEquals(event.data.source, "./example.fart");
      assertEquals(event.data.dependencies, ["Example1", "Example2"]);
      return "ABC";
    },
  );
  const result = await transpile(
    "load './example.fart' ( Example1, Example2 )",
    fakeCart,
  );
  assertEquals(result, "ABC");
});

Deno.test("transpiles struct_open event", async () => {
  const fakeCart = new Cartridge();
  fakeCart.on(
    CartridgeEvent.StructOpen,
    (event: CartridgeEventContext<CartridgeEvent.StructOpen>) => {
      assertEquals(event.data.name, "Example");
      assertEquals(event.data.comments, []);
      return "ABC";
    },
  );
  const result = await transpile(`type Example {`, fakeCart);
  assertEquals(result, "ABC");
});

Deno.test("transpiles set_property event", async () => {
  const fakeCart = new Cartridge();
  fakeCart.on(
    CartridgeEvent.SetProperty,
    (event: CartridgeEventContext<CartridgeEvent.SetProperty>) => {
      assertEquals(event.data.name, "example");
      assertEquals(event.data.definition.optional, false);
      assertEquals(event.data.comments, []);
      return "ABC";
    },
  );
  const result = await transpile(
    `type Example { example: string }`,
    fakeCart,
  );
  assertEquals(result, "ABC");
});

Deno.test("transpiles optional property event", async () => {
  const fakeCart = new Cartridge();
  fakeCart.on(
    CartridgeEvent.SetProperty,
    (event: CartridgeEventContext<CartridgeEvent.SetProperty>) => {
      assertEquals(event.data.name, "example");
      assertEquals(event.data.definition.optional, true);
      assertEquals(event.data.comments, []);
      return "ABC";
    },
  );
  const result = await transpile(
    `type Example { example?: string }`,
    fakeCart,
  );
  assertEquals(result, "ABC");
});

Deno.test("transpiles tuple definitions", async () => {
  const fakeCart = new Cartridge();
  const result = await transpile(
    `type Example { example: (string) }`,
    fakeCart,
  );
  assertEquals(result, ""); // Cart doesn't emit text for this, but tests the branching logic.
});

Deno.test("transpiles text literal properties", async () => {
  const fakeCart = new Cartridge();
  const result = await transpile(
    `type Example { example: 'some_literal_string' }`,
    fakeCart,
  );
  assertEquals(result, "");
});

// Top-level Fart transpile parsing ignores invalid raw tokens like identifiers.

Deno.test("transpile throws on missing struct opener", async () => {
  const fakeCart = new Cartridge();
  try {
    await transpile("type Example ", fakeCart);
    throw new Error("Should have thrown");
  } catch (err) {
    assertEquals((err as Error).message.includes("but got undefined"), true);
  }
});

Deno.test("transpile throws on invalid struct property configuration", async () => {
  const fakeCart = new Cartridge();
  try {
    await transpile("type Example { example: , }", fakeCart);
    throw new Error("Should have thrown");
  } catch (err) {
    assertEquals(
      (err as Error).message.includes("Expected struct opener"),
      true,
    );
  }
});

Deno.test("transpile throws on invalid tuple component", async () => {
  const fakeCart = new Cartridge();
  try {
    await transpile("type Example { example: ( { ) }", fakeCart);
    throw new Error("Should have thrown");
  } catch (err) {
    assertEquals((err as Error).message.includes("Expected identifier"), true);
  }
});

Deno.test("transpile gracefully ignores unmatched top-level identifiers", async () => {
  const fakeCart = new Cartridge();
  const result = await transpile("some_random_identifier", fakeCart);
  assertEquals(result, "");
});

Deno.test("TranspilationContext nextMod handles modifier reduction", () => {
  const typemap: CartridgeTypeMap = {
    [Modifier.Array]: (val: string) => `${val}[]`,
    [Modifier.Async]: (val: string) => `Promise<${val}>`,
  };
  const fakeCart = new Cartridge(typemap);
  const iterator = tokenize("array % async % some_identifier");
  const ctx = new TranspilationContext(iterator, fakeCart);
  const result = ctx.nextMod();
  assertEquals(result, "Promise<some_identifier>[]");
});

Deno.test("TranspilationContext nextMod handles TupleOpener", () => {
  const typemap: CartridgeTypeMap = {
    [Modifier.Array]: (val: string) => `${val}[]`,
  };
  const fakeCart = new Cartridge(typemap);
  const iterator = tokenize("array % ( some_identifier )");
  const ctx = new TranspilationContext(iterator, fakeCart);
  ctx.nextMod(); // We just want to ensure it doesn't crash on TupleOpener branch
});
