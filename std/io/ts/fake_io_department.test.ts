import { assertEquals } from "../../../deps/std/testing.ts";
import { FakeIODepartment } from "./fake_io_department.ts";

const assertReturnsVoid = (value: unknown) => assertEquals(value, undefined);

Deno.test("Returns the path.", async () => {
  const testdataPath = "/std/io/testdata/pikachu.json";
  const io = new FakeIODepartment();
  const file = await io.readFile(testdataPath);
  assertEquals(file, testdataPath);
});

Deno.test("Returns the path when asked to read if exists.", async () => {
  const testdataPath = "/std/io/testdata/pikachu.json";
  const io = new FakeIODepartment();
  const file = await io.readIfExists(testdataPath);
  assertEquals(file, testdataPath);
});

Deno.test("Returns the path when asked to fetch if valid.", async () => {
  const testdataPath = "https://example.com/pikachu.json";
  const io = new FakeIODepartment();
  const file = await io.fetchIfValidURL(testdataPath);
  assertEquals(file, testdataPath);
});

Deno.test("Does nothing when asked to write.", async () => {
  const io = new FakeIODepartment();
  assertReturnsVoid(await io.writeFile("/example.txt", "nothingness"));
});
