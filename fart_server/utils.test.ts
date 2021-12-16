import { assertEquals } from "../deps/std/testing.ts";
import type { MatchingFunction } from "./utils.ts";
import { matchHome, matchSubroute, register, route } from "./utils.ts";

const assertMatches = async (matchingFn: MatchingFunction, url: string) => {
  const expectation = new Response("Hello, world!");
  register(matchingFn, () => expectation);
  const reality = await route(new Request(url));
  assertEquals(reality, expectation);
};

Deno.test("matches a simple home route", async () => {
  await assertMatches(matchHome, "https://example.com/");
});

Deno.test("matches a custom route", async () => {
  await assertMatches(matchSubroute("/abc"), "http://example.com/abc");
});
