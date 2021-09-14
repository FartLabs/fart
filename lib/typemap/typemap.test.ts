import { ModifierMode, ReservedType, TypeMap } from "./typemap.ts";
import { assert, assertEquals, assertThrows } from "../../deps/std/testing.ts";

const PREFIX = "async_";
const SUFFIX = "_list";
const MODIFY_ASYNC = (t: string) => `Promise<${t}>`;
const MODIFY_LIST = (t: string) => `${t}[]`;

Deno.test("Throws when instantiated with empty input", () => {
  assertThrows(() => new TypeMap(), Error);
});

Deno.test("Throws when missing one required type", () => {
  assertThrows(() =>
    new TypeMap([
      // Skipping ReservedType.String
      [ReservedType.Number, "float64"],
      [ReservedType.Boolean, "bool"],
    ]), Error);
});

Deno.test("Successfully instantiates typemap", () => {
  const typemap = new TypeMap([
    [ReservedType.Number, "float64"],
    [ReservedType.String, "string"],
    [ReservedType.Boolean, "bool"],
  ]);
  const success = typemap.size === 3;
  assert(success);
});

Deno.test("Successfully instantiates typemap with a prefix modifier", () => {
  const typemap = new TypeMap([
    [ReservedType.Number, "number"],
    [ReservedType.String, "string"],
    [ReservedType.Boolean, "boolean"],
  ]);
  // "async_" => Promise<T>
  typemap.addModifier(PREFIX, MODIFY_ASYNC);
  assertEquals(typemap.get(PREFIX + ReservedType.Number), "Promise<number>");
  assertEquals(typemap.get(PREFIX + ReservedType.String), "Promise<string>");
  assertEquals(typemap.get(PREFIX + ReservedType.Boolean), "Promise<boolean>");
});

Deno.test("Successfully instantiates typemap with a suffix modifier", () => {
  const typemap = new TypeMap([
    [ReservedType.Number, "number"],
    [ReservedType.String, "string"],
    [ReservedType.Boolean, "boolean"],
  ]);
  // "_list" => T[] (aka Array<T>)
  typemap.addModifier(SUFFIX, MODIFY_LIST, ModifierMode.Suffix);
  assertEquals(typemap.get(ReservedType.Number + SUFFIX), "number[]");
  assertEquals(typemap.get(ReservedType.String + SUFFIX), "string[]");
  assertEquals(typemap.get(ReservedType.Boolean + SUFFIX), "boolean[]");
});

Deno.test("Successfully instantiates typemap with prefix and suffix modifiers", () => {
  const typemap = new TypeMap([
    [ReservedType.Number, "number"],
    [ReservedType.String, "string"],
    [ReservedType.Boolean, "boolean"],
  ]);
  typemap.addModifier(PREFIX, MODIFY_ASYNC);
  typemap.addModifier(SUFFIX, MODIFY_LIST, ModifierMode.Suffix);
  assertEquals(typemap.get(PREFIX + ReservedType.Number), "Promise<number>");
  assertEquals(typemap.get(PREFIX + ReservedType.String), "Promise<string>");
  assertEquals(typemap.get(PREFIX + ReservedType.Boolean), "Promise<boolean>");
  assertEquals(typemap.get(ReservedType.Number + SUFFIX), "number[]");
  assertEquals(typemap.get(ReservedType.String + SUFFIX), "string[]");
  assertEquals(typemap.get(ReservedType.Boolean + SUFFIX), "boolean[]");
});

Deno.test("Successfully removes modifier", () => {
  const typemap = new TypeMap([
    [ReservedType.Number, "number"],
    [ReservedType.String, "string"],
    [ReservedType.Boolean, "boolean"],
  ]);
  const modifierId = typemap.addModifier(PREFIX, MODIFY_ASYNC);
  assertEquals(typemap.get(PREFIX + ReservedType.Number), "Promise<number>");
  typemap.removeModifier(modifierId);
  // No error is expected to be thrown when attempting to remove a
  // nonexistant modifer.
  typemap.removeModifier(1234567890);
  assertEquals(typemap.get(PREFIX + ReservedType.Number), undefined);
});

Deno.test("Prefixed key is modified successfully", () => {
  const actual = TypeMap.modifyKey(PREFIX + ReservedType.Number, {
    alias: PREFIX,
    modify: MODIFY_ASYNC,
    mode: ModifierMode.Prefix,
  });
  assertEquals(actual, ReservedType.Number);
});

Deno.test("Suffixed key is modified successfully", () => {
  const actual = TypeMap.modifyKey(ReservedType.Number + SUFFIX, {
    alias: SUFFIX,
    modify: MODIFY_LIST,
    mode: ModifierMode.Suffix,
  });
  assertEquals(actual, ReservedType.Number);
});
