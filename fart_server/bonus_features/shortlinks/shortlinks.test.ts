import { assertEquals } from "../../../deps/std/testing.ts";
import { redirectIfShortlink } from "./shortlinks.ts";
import shortlinks from "./shortlinks.json" assert { type: "json" };

Deno.test("shortlink redirects to GitHub repository", () => {
  const request = new Request("http://localhost:8080/github");
  const response = redirectIfShortlink(request);
  assertEquals(response?.status, 302);
  assertEquals(response?.headers.get("location"), shortlinks["/github"] + "/");
});

Deno.test("shortlink redirects to GitHub repository and preserves path", () => {
  const request = new Request(
    "http://localhost:8080/github/milestone/1?closed=1",
  );
  const response = redirectIfShortlink(request);
  assertEquals(response?.status, 302);
  assertEquals(
    response?.headers.get("location"),
    shortlinks["/github"] +
      "/milestone/1?closed=1",
  );
});

Object.entries(shortlinks)
  .forEach(([shortlink, destination]) => {
    // add a slash if the destination doesn't end with one
    if (!destination.endsWith("/")) destination += "/";

    Deno.test(`shortlink ${shortlink} redirects to ${destination}`, () => {
      const request = new Request("http://localhost:8080" + shortlink);
      const response = redirectIfShortlink(request);
      assertEquals(response?.status, 302);
      assertEquals(response?.headers.get("location"), destination);
    });
  });
