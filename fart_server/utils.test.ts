import { assertEquals } from "../deps/std/testing.ts";
import { clear, getSize, inject, register } from "./utils.ts";

// Note: Make sure each test clears the handlers if changes were made.

Deno.test("returns 404 without registering a handler", async () => {
  const { status } = await inject(new Request("https://example.com/"));
  assertEquals(status, 404);
});

Deno.test("size of handlers is 0 without registering a handler", () => {
  assertEquals(getSize(), 0);
});

Deno.test("size is reduced to 0 when clear is called", () => {
  register(() => null);
  assertEquals(getSize(), 1);
  register(() => null, () => null);
  assertEquals(getSize(), 3);
  clear();
  assertEquals(getSize(), 0);
});

Deno.test("returns 404 when all handlers return null", async () => {
  register(() => null);
  const { status } = await inject(new Request("https://example.com/"));
  assertEquals(status, 404);
  clear();
});

Deno.test("returns data when a handler returns a response", async () => {
  register(() => new Response("abc"));
  const response = await inject(new Request("https://example.com/"));
  assertEquals(await response.text(), "abc");
  clear();
});

Deno.test("returns data when a handler returns a response and cascades on null", async () => {
  register(() => null, () => null, () => null, () => new Response("abc"));
  const response = await inject(new Request("https://example.com/"));
  assertEquals(await response.text(), "abc");
  clear();
});
