import { assertEquals } from "../../deps/std/testing.ts";
import { TranspilationContext, transpile } from "./transpile.ts";
import { Cartridge, CartridgeEvent } from "./cartridge/mod.ts";
import type { CartridgeEventContext } from "./cartridge/mod.ts";
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
// StructClose = "struct_close",
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
// FileEnd = "file_end",

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
