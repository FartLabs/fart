import { assertEquals } from "@std/assert";
import { getIndent } from "./utils.ts";
import type { IndentOption } from "./indent.ts";

Deno.test("getIndent with non-cached custom string indent", () => {
  assertEquals(getIndent("#", 3), "###");
  assertEquals(getIndent("_", 5), "_____");
});

Deno.test("getIndent with invalid negative levels defaults cleanly", () => {
  assertEquals(getIndent(1, -5), "");
  assertEquals(getIndent("#", -2), "");
});

Deno.test("getIndent with invalid indent options", () => {
  assertEquals(getIndent(5 as unknown as IndentOption, 1), ""); // 5 is not an IndentOption
  assertEquals(getIndent(999 as unknown as IndentOption, 1), ""); // 999 is not an IndentOption
});
