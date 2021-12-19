import { assertEquals } from "../../../deps/std/testing.ts";
import { CodeBlock } from "./code_block.ts";

Deno.test("new code block is empty", () => {
  assertEquals(new CodeBlock().export(), "");
});

Deno.test("add 3 lines of code to the block", () => {
  const block = new CodeBlock();
  block.append("a");
  block.append("b");
  block.append("c");
  const expectation = "a\nb\nc";
  const reality = block.export();
  assertEquals(expectation, reality);
});

Deno.test("add 3 lines of code to the block (indented)", () => {
  const block = new CodeBlock();
  block.append("a", 0);
  block.append("b", 1);
  block.append("c", 2);
  const expectation = "a\n  b\n    c";
  const reality = block.export();
  assertEquals(expectation, reality);
});

Deno.test("join 3 code blocks", () => {
  const block1 = new CodeBlock();
  block1.append("a", 0);
  block1.append("b", 1);
  block1.append("c", 2);
  const block2 = new CodeBlock();
  block2.append("d", 1);
  block2.append("e", 0);
  block2.append("f", 1);
  const block3 = new CodeBlock();
  block3.append("g", 2);
  block3.append("h", 1);
  block3.append("i", 0);
  const expectation = `a
  b
    c

  d
e
  f

    g
  h
i`;
  const reality = CodeBlock.join(block1, block2, block3);
  assertEquals(expectation, reality);
});
