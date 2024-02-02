import { assertEquals } from "../developer_deps.ts";
import { generateCodeBlock, indentCodeBlock } from "./code_block.ts";

Deno.test("indentCodeBlock", () => {
  assertEquals(
    indentCodeBlock("hello\nworld", {
      newLine: "\n",
      indentNumberOfSpaces: 2,
      useTabs: false,
      indentLevel: 1,
    }),
    "  hello\n  world",
  );
  assertEquals(
    indentCodeBlock("hello\nworld", {
      newLine: "\n",
      indentNumberOfSpaces: 2,
      useTabs: true,
      indentLevel: 1,
    }),
    "\thello\n\tworld",
  );
});

Deno.test("generateCodeBlock", () => {
  assertEquals(
    generateCodeBlock({
      type: "code_block",
      properties: {
        newLine: "\n",
        indentNumberOfSpaces: 2,
        useTabs: false,
        indentLevel: 1,
      },
      children: [
        "hello\nworld",
      ],
    }),
    "  hello\n  world",
  );
});
