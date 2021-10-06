import { Registry } from "./registry.ts";
import { assertEquals } from "../../deps/std/testing.ts";

class Dummy {
  constructor(private id?: string) {}
  someCapability(x: string): string {
    return x;
  }
}

Deno.test("Parses registry ID", () => {
  const actual = Registry.parseId("a");
  const expected = ["a"];
  assertEquals(actual, expected);
});

Deno.test("Parses registry ID with 3 segments", () => {
  const actual = Registry.parseId("a.b.c");
  const expected = ["a", "b", "c"];
  assertEquals(actual, expected);
});

Deno.test("Registers class instance successfully", () => {
  const dummy = new Dummy();
  const reg = new Registry<Dummy>("_", dummy);
  const actual = reg.value;
  const expected = dummy;
  assertEquals(actual, expected);
});

Deno.test("Registers class instance recursively", () => {
  const dummy = new Dummy();
  const reg = new Registry<Dummy>("_");
  reg.set("a.b.c", dummy);
  const actual = reg.vendor("a.b.c");
  const expected = dummy;
  assertEquals(actual, expected);
});

Deno.test("Gets class instance with default keyword", () => {
  const dummy = new Dummy();
  const reg = new Registry<Dummy>("_");
  reg.set("a.b.c", dummy);
  const actual = reg.vendor("a.b.c.default");
  const expected = dummy;
  assertEquals(actual, expected);
});

Deno.test("Registers class instance recursively via chaining", () => {
  const dummy = new Dummy();
  const reg = new Registry<Dummy>("_");
  reg.set("a.b.c", dummy);
  const actual = reg.get("a")?.get("b")?.get("c")?.vendor();
  const expected = dummy;
  assertEquals(actual, expected);
});

Deno.test("Vendors successfully from sample registry", () => {
  const dummy = new Dummy();
  const targetDummy = new Dummy("target");
  const baseRegistry = new Registry<Dummy>("_");
  const tsRegistry = new Registry<Dummy>("ts", dummy);
  tsRegistry.set("deno", dummy);
  tsRegistry.set("deno.api", targetDummy);
  baseRegistry.include(tsRegistry);
  const actual = baseRegistry.vendor("ts.deno.api");
  const expected = targetDummy;
  assertEquals(actual, expected);
});
