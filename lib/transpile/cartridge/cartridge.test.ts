import { assertEquals } from "../../../deps/std/testing.ts";
import { Cartridge, CartridgeEvent } from "./cartridge.ts";
import { CodeBlock } from "../code_block/mod.ts";

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

Deno.test("event 'inline_comment' makes a successful dispatch", async () => {
  const cartridge = new Cartridge();
  cartridge.on(
    CartridgeEvent.InlineComment,
    (event) => {
      assertEquals(
        event.type,
        CartridgeEvent.InlineComment,
        "matches event name",
      );
      assertEquals(event.data.comments.length, 1, "expects 1 comment");
      return event.data.comments.map((comment) => `// ${comment}`).join("\n");
    },
  );
  const expectation = "// ABC";
  const reality = await cartridge.dispatch(CartridgeEvent.InlineComment, {
    type: CartridgeEvent.InlineComment,
    code: new CodeBlock(),
    data: { comments: ["ABC"] },
    tokens: [],
  });
  assertEquals(expectation, reality);
});

Deno.test("event 'multiline_comment' makes a successful dispatch", async () => {
  const cartridge = new Cartridge();
  cartridge.on(
    CartridgeEvent.MultilineComment,
    (event) => {
      assertEquals(
        event.type,
        CartridgeEvent.MultilineComment,
        "matches event name",
      );
      assertEquals(event.data.comments.length, 3, "expects 3 comment lines");
      return event.data.comments.map((comment) => `// ${comment}`).join("\n");
    },
  );
  const expectation = `// ABC
// DEF
// GEH`;
  const reality = await cartridge.dispatch(CartridgeEvent.MultilineComment, {
    type: CartridgeEvent.MultilineComment,
    code: new CodeBlock(),
    data: { comments: ["ABC", "DEF", "GEH"] },
    tokens: [],
  });
  assertEquals(expectation, reality);
});

Deno.test("event 'load' makes a successful dispatch", async () => {
  const cartridge = new Cartridge();
  cartridge.on(
    CartridgeEvent.Load,
    (event) => {
      assertEquals(
        event.type,
        CartridgeEvent.Load,
        "matches event name",
      );
      assertEquals(event.data.source, "example.fart", "matches source");
      assertEquals(event.data.dependencies, [
        "Example1",
        "Example2",
        "Example3",
      ]);
      return `import { ${
        event.data.dependencies.join(", ")
      } } from "${event.data.source}";`;
    },
  );
  const expectation =
    `import { Example1, Example2, Example3 } from "example.fart";`;
  const reality = await cartridge.dispatch(CartridgeEvent.Load, {
    type: CartridgeEvent.Load,
    code: new CodeBlock(),
    data: {
      comments: [],
      source: "example.fart",
      dependencies: ["Example1", "Example2", "Example3"],
    },
    tokens: [],
  });
  assertEquals(expectation, reality);
});

Deno.test("event 'struct_open' makes a successful dispatch (with comment)", async () => {
  const cartridge = new Cartridge();
  cartridge.on(
    CartridgeEvent.StructOpen,
    (event) => {
      assertEquals(
        event.type,
        CartridgeEvent.StructOpen,
        "matches event name",
      );
      assertEquals(event.data.name, "Example", "matches name");
      assertEquals(event.data.comments.length, 1, "expects 1 comment");
      return `// ${event.data.comments[0]}
interface ${event.data.name} {`;
    },
  );
  const expectation = `// ABC
interface Example {`;
  const reality = await cartridge.dispatch(CartridgeEvent.StructOpen, {
    type: CartridgeEvent.StructOpen,
    code: new CodeBlock(),
    data: { name: "Example", comments: ["ABC"] },
    tokens: [],
  });
  assertEquals(expectation, reality);
});

Deno.test("event 'set_property' makes a successful dispatch", async () => {
  const cartridge = new Cartridge();
  cartridge.on(
    CartridgeEvent.SetProperty,
    (event) => {
      assertEquals(
        event.type,
        CartridgeEvent.SetProperty,
        "matches event name",
      );
      return `${event.data.name}: ${event.data.definition.value};`;
    },
  );
  const expectation = `example: string;`;
  const reality = await cartridge.dispatch(CartridgeEvent.SetProperty, {
    type: CartridgeEvent.SetProperty,
    code: new CodeBlock(),
    data: { name: "example", definition: { value: "string" }, comments: [] },
    tokens: [],
  });
  assertEquals(expectation, reality);
});

Deno.test("event 'struct_close' makes a successful dispatch", async () => {
  const cartridge = new Cartridge();
  cartridge.on(
    CartridgeEvent.StructClose,
    (event) => {
      assertEquals(
        event.type,
        CartridgeEvent.StructClose,
        "matches event name",
      );
      return "}";
    },
  );
  const expectation = `}`;
  const reality = await cartridge.dispatch(CartridgeEvent.StructClose, {
    type: CartridgeEvent.StructClose,
    code: new CodeBlock(),
    data: null,
    tokens: [],
  });
  assertEquals(expectation, reality);
});

Deno.test("event 'file_end' makes a successful dispatch", async () => {
  const cartridge = new Cartridge();
  cartridge.on(
    CartridgeEvent.FileEnd,
    (event) => {
      assertEquals(
        event.type,
        CartridgeEvent.FileEnd,
        "matches event name",
      );
      return `XYZ`;
    },
  );
  const expectation = `XYZ`;
  const reality = await cartridge.dispatch(CartridgeEvent.FileEnd, {
    type: CartridgeEvent.FileEnd,
    code: new CodeBlock(),
    data: null,
    tokens: [],
  });
  assertEquals(expectation, reality);
});
