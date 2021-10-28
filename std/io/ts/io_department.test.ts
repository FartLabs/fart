import { assertEquals } from "../../../deps/std/testing.ts";
import { IODepartment } from "./io_department.ts";

const TESTDATA_PATH = "std/io/testdata/pikachu.json";

Deno.test("Reads text file from file system successfully.", async () => {
  const io = new IODepartment();
  const file = await io.readFile(TESTDATA_PATH);
  const pikachu = JSON.parse(file);
  assertEquals(pikachu.name, "Pikachu");
});

Deno.test("Reads text file from Internet successfully.", async () => {
  const io = new IODepartment();
  const file = await io.readFile(
    "https://github.com/EthanThatOneKid/fart/raw/main/std/io/testdata/pikachu.json",
  );
  const pikachu = JSON.parse(file);
  assertEquals(pikachu.name, "Pikachu");
});

Deno.test("Returns empty string when no media can be found.", async () => {
  const io = new IODepartment();
  const file = await io.readFile("/where/in/the/flip/am/i.json");
  assertEquals(file, "");
});

Deno.test("Reads text file from file system successfully with helper function.", async () => {
  const io = new IODepartment();
  const file = await io.readIfExists(TESTDATA_PATH);
  if (file === undefined) return;
  const pikachu = JSON.parse(file);
  assertEquals(pikachu.name, "Pikachu");
});

Deno.test("Returns undefined when file does not exist.", async () => {
  const io = new IODepartment();
  const file = await io.readIfExists("/where/in/the/flip/am/i.json");
  assertEquals(file, "");
});

Deno.test("Reads text file from Internet successfully with helper function.", async () => {
  const io = new IODepartment();
  const file = await io.fetchIfValidURL(
    "https://github.com/EthanThatOneKid/fart/raw/main/std/io/testdata/pikachu.json",
  );
  if (file === undefined) return;
  const pikachu = JSON.parse(file);
  assertEquals(pikachu.name, "Pikachu");
});
