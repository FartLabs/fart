import { compile } from "./compile.ts";
import { assertEquals } from "../devdeps/std/testing.ts";

Deno.test("Empty input results in empty output", () => {
  const actual = compile(``);
  const expected = ``;
  assertEquals(actual, expected);
});
