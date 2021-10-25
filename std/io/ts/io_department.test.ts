import { assertEquals } from "../../../deps/std/testing.ts";
import { IODepartment } from "./io_department.ts";

Deno.test("Reads text file from file system successfully.", async () => {
  const io = new IODepartment();
  const file = await io.readFile("/std/io/testdata/pikachu.json");
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
  const file = await io.readFile("/where/in/the/fuck/am/i.json");
  assertEquals(file, "");
});
