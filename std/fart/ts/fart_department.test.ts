import { FartDepartment } from "./fart_department.ts";
import { assertEquals } from "../../../deps/std/testing.ts";

Deno.test("Initializes successfully", () => {
  const fart = new FartDepartment();
  assertEquals(fart, fart);
});
