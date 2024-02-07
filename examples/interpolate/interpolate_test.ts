import { assertEquals } from "./developer_deps.ts";
import { interpolate } from "./interpolate.ts";

Deno.test("interpolate", () => {
  assertEquals(
    interpolate(
      'console.log("Hello, ${name}!");\nconsole.log("Favorite number: ${favoriteNumber}");',
      { name: "world", favoriteNumber: 42 },
    ),
    `console.log("Hello, world!");
console.log("Favorite number: 42");`,
  );
});
