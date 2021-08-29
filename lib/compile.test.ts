import { compile } from "./compile.ts";
import { assertEquals } from "../devdeps/std/testing.ts";

Deno.test("Empty input results in empty output", () => {
  const actual = compile(``);
  const expected = ``;
  assertEquals(actual, expected);
});

Deno.test("Successfully compiles `impo` statement", () => {
  const actual = compile(`impo \`./path/to/types\` {
    Thing1, Thing2, Thing3
  }`);
  const expected =
    `import type { Thing1, Thing2, Thing3 } from "./path/to/types.ts";`;
  assertEquals(actual, expected);
});

Deno.test("Successfully compiles `type` statement", () => {
  const actual = compile(`type Thing {
    abc: string
    def: number
    ghi: boolean
  }`);
  const expected = `export interface Thing {
  abc?: string;
  def?: number;
  ghi?: boolean;
}`;
  assertEquals(actual, expected);
});

Deno.test("Successfully compiles nested `type` statement", () => {
  const actual = compile(`type Thing {
    abc: string
    def: number
    ghi: {
      uvw: boolean
      xyz: boolean
    }
  }`);
  const expected = `export interface Thing {
  abc?: string;
  def?: number;
  ghi?: {
    uvw?: boolean;
    xyz?: boolean;
  }
}`;
  assertEquals(actual, expected);
});
