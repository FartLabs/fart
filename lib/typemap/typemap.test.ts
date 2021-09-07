import { ReservedType, TypeMap } from "./typemap.ts";
import { assert, assertThrows } from "../../deps/std/testing.ts";

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
