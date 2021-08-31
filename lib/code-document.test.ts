import { compile } from "./compile.ts";
import { assertEquals } from "../devdeps/std/testing.ts";

// TODO: Write tests for `CodeDocument`.
Deno.test("Empty input results in empty output", () => {
  const actual = compile(``);
  const expected = ``;
  assertEquals(actual, expected);
});
