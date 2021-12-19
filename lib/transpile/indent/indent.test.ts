import { assertEquals } from "../../../deps/std/testing.ts";
import { INDENT, Indent } from "./indent.ts";

Deno.test("cache of Indent.Tab1 equals 1 tab", () => {
  assertEquals(INDENT[Indent.Tab1], "\t".repeat(1));
});

Deno.test("cache of Indent.Tab2 equals 2 tabs", () => {
  assertEquals(INDENT[Indent.Tab2], "\t".repeat(2));
});

Deno.test("cache of Indent.Tab3 equals 3 tabs", () => {
  assertEquals(INDENT[Indent.Tab3], "\t".repeat(3));
});

Deno.test("cache of Indent.Tab4 equals 4 tabs", () => {
  assertEquals(INDENT[Indent.Tab4], "\t".repeat(4));
});

Deno.test("cache of Indent.Tab5 equals 5 tabs", () => {
  assertEquals(INDENT[Indent.Tab5], "\t".repeat(5));
});

Deno.test("cache of Indent.Tab6 equals 6 tabs", () => {
  assertEquals(INDENT[Indent.Tab6], "\t".repeat(6));
});

Deno.test("cache of Indent.Tab7 equals 7 tabs", () => {
  assertEquals(INDENT[Indent.Tab7], "\t".repeat(7));
});

Deno.test("cache of Indent.Tab8 equals 8 tabs", () => {
  assertEquals(INDENT[Indent.Tab8], "\t".repeat(8));
});

Deno.test("cache of Indent.Tab9 equals 9 tabs", () => {
  assertEquals(INDENT[Indent.Tab9], "\t".repeat(9));
});

Deno.test("cache of Indent.Tab10 equals 10 tabs", () => {
  assertEquals(INDENT[Indent.Tab10], "\t".repeat(10));
});

Deno.test("cache of Indent.Tab11 equals 11 tabs", () => {
  assertEquals(INDENT[Indent.Tab11], "\t".repeat(11));
});

Deno.test("cache of Indent.Tab12 equals 12 tabs", () => {
  assertEquals(INDENT[Indent.Tab12], "\t".repeat(12));
});

Deno.test("cache of Indent.Tab13 equals 13 tabs", () => {
  assertEquals(INDENT[Indent.Tab13], "\t".repeat(13));
});

Deno.test("cache of Indent.Tab14 equals 14 tabs", () => {
  assertEquals(INDENT[Indent.Tab14], "\t".repeat(14));
});

Deno.test("cache of Indent.Tab15 equals 15 tabs", () => {
  assertEquals(INDENT[Indent.Tab15], "\t".repeat(15));
});

Deno.test("cache of Indent.Tab16 equals 16 tabs", () => {
  assertEquals(INDENT[Indent.Tab16], "\t".repeat(16));
});

Deno.test("cache of Indent.Space1 equals 1 spaces", () => {
  assertEquals(INDENT[Indent.Space1], " ".repeat(1));
});

Deno.test("cache of Indent.Space2 equals 2 spaces", () => {
  assertEquals(INDENT[Indent.Space2], " ".repeat(2));
});

Deno.test("cache of Indent.Space3 equals 3 spaces", () => {
  assertEquals(INDENT[Indent.Space3], " ".repeat(3));
});

Deno.test("cache of Indent.Space4 equals 4 spaces", () => {
  assertEquals(INDENT[Indent.Space4], " ".repeat(4));
});

Deno.test("cache of Indent.Space5 equals 5 spaces", () => {
  assertEquals(INDENT[Indent.Space5], " ".repeat(5));
});

Deno.test("cache of Indent.Space6 equals 6 spaces", () => {
  assertEquals(INDENT[Indent.Space6], " ".repeat(6));
});

Deno.test("cache of Indent.Space7 equals 7 spaces", () => {
  assertEquals(INDENT[Indent.Space7], " ".repeat(7));
});

Deno.test("cache of Indent.Space8 equals 8 spaces", () => {
  assertEquals(INDENT[Indent.Space8], " ".repeat(8));
});

Deno.test("cache of Indent.Space9 equals 9 spaces", () => {
  assertEquals(INDENT[Indent.Space9], " ".repeat(9));
});

Deno.test("cache of Indent.Space10 equals 10 spaces", () => {
  assertEquals(INDENT[Indent.Space10], " ".repeat(10));
});

Deno.test("cache of Indent.Space11 equals 11 spaces", () => {
  assertEquals(INDENT[Indent.Space11], " ".repeat(11));
});

Deno.test("cache of Indent.Space12 equals 12 spaces", () => {
  assertEquals(INDENT[Indent.Space12], " ".repeat(12));
});

Deno.test("cache of Indent.Space13 equals 13 spaces", () => {
  assertEquals(INDENT[Indent.Space13], " ".repeat(13));
});

Deno.test("cache of Indent.Space14 equals 14 spaces", () => {
  assertEquals(INDENT[Indent.Space14], " ".repeat(14));
});

Deno.test("cache of Indent.Space15 equals 15 spaces", () => {
  assertEquals(INDENT[Indent.Space15], " ".repeat(15));
});

Deno.test("cache of Indent.Space16 equals 16 spaces", () => {
  assertEquals(INDENT[Indent.Space16], " ".repeat(16));
});

Deno.test("cache of Indent.Space18 equals 18 spaces", () => {
  assertEquals(INDENT[Indent.Space18], " ".repeat(18));
});

Deno.test("cache of Indent.Space20 equals 20 spaces", () => {
  assertEquals(INDENT[Indent.Space20], " ".repeat(20));
});

Deno.test("cache of Indent.Space21 equals 21 spaces", () => {
  assertEquals(INDENT[Indent.Space21], " ".repeat(21));
});

Deno.test("cache of Indent.Space22 equals 22 spaces", () => {
  assertEquals(INDENT[Indent.Space22], " ".repeat(22));
});

Deno.test("cache of Indent.Space24 equals 24 spaces", () => {
  assertEquals(INDENT[Indent.Space24], " ".repeat(24));
});

Deno.test("cache of Indent.Space26 equals 26 spaces", () => {
  assertEquals(INDENT[Indent.Space26], " ".repeat(26));
});

Deno.test("cache of Indent.Space27 equals 27 spaces", () => {
  assertEquals(INDENT[Indent.Space27], " ".repeat(27));
});

Deno.test("cache of Indent.Space28 equals 28 spaces", () => {
  assertEquals(INDENT[Indent.Space28], " ".repeat(28));
});

Deno.test("cache of Indent.Space30 equals 30 spaces", () => {
  assertEquals(INDENT[Indent.Space30], " ".repeat(30));
});

Deno.test("cache of Indent.Space32 equals 32 spaces", () => {
  assertEquals(INDENT[Indent.Space32], " ".repeat(32));
});

Deno.test("cache of Indent.Space33 equals 33 spaces", () => {
  assertEquals(INDENT[Indent.Space33], " ".repeat(33));
});

Deno.test("cache of Indent.Space36 equals 36 spaces", () => {
  assertEquals(INDENT[Indent.Space36], " ".repeat(36));
});

Deno.test("cache of Indent.Space39 equals 39 spaces", () => {
  assertEquals(INDENT[Indent.Space39], " ".repeat(39));
});

Deno.test("cache of Indent.Space40 equals 40 spaces", () => {
  assertEquals(INDENT[Indent.Space40], " ".repeat(40));
});

Deno.test("cache of Indent.Space42 equals 42 spaces", () => {
  assertEquals(INDENT[Indent.Space42], " ".repeat(42));
});

Deno.test("cache of Indent.Space44 equals 44 spaces", () => {
  assertEquals(INDENT[Indent.Space44], " ".repeat(44));
});

Deno.test("cache of Indent.Space45 equals 45 spaces", () => {
  assertEquals(INDENT[Indent.Space45], " ".repeat(45));
});

Deno.test("cache of Indent.Space48 equals 48 spaces", () => {
  assertEquals(INDENT[Indent.Space48], " ".repeat(48));
});

Deno.test("cache of Indent.Space52 equals 52 spaces", () => {
  assertEquals(INDENT[Indent.Space52], " ".repeat(52));
});

Deno.test("cache of Indent.Space56 equals 56 spaces", () => {
  assertEquals(INDENT[Indent.Space56], " ".repeat(56));
});

Deno.test("cache of Indent.Space60 equals 60 spaces", () => {
  assertEquals(INDENT[Indent.Space60], " ".repeat(60));
});
