import { FartDepartment } from "./fart_department.ts";
import { FakeIODepartment } from "../../io/ts/fake_io_department.ts";
import { assertEquals } from "../../../deps/std/testing.ts";

Deno.test("Initializes successfully", () => {
  const fart = new FartDepartment(new FakeIODepartment());
  assertEquals(fart, fart);
});
