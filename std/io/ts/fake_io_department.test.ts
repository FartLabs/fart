import { assertEquals } from "../../../deps/std/testing.ts";
import { FakeIODepartment } from "./fake_io_department.ts";

const assertReturnsVoid = (value: unknown) => assertEquals(value, undefined);

const TESTDATA_PATH = "std/io/testdata/pikachu.json";

Deno.test("Returns the path.", async () => {
  const io = new FakeIODepartment();
  const file = await io.readFile(TESTDATA_PATH);
  assertEquals(file, TESTDATA_PATH);
});

Deno.test("Returns the path when asked to read if exists.", async () => {
  const io = new FakeIODepartment();
  const file = await io.readIfExists(TESTDATA_PATH);
  assertEquals(file, TESTDATA_PATH);
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
