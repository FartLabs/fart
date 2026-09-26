import { assertEquals, assertStringIncludes } from "@std/assert";
import { serveDoc, serveReadme } from "./docs.ts";

const get = (path: string) => new Request(`http://localhost:8080${path}`);

Deno.test("serveReadme renders the README at the site root", async () => {
  const response = await serveReadme(get("/"));

  assertEquals(response?.status, 200);
  assertEquals(
    response?.headers.get("Content-Type"),
    "text/html; charset=utf-8",
  );
  const html = await response!.text();
  assertStringIncludes(html, "<!DOCTYPE html>");
  assertStringIncludes(html, "Fart");
  // README's first heading is used as the page title
  assertStringIncludes(html, "<title>Fart 🌫</title>");
});

Deno.test("serveReadme ignores non-root paths", async () => {
  assertEquals(await serveReadme(get("/pokemon-example")), null);
});

Deno.test("serveDoc renders a document from docs/", async () => {
  const response = await serveDoc(get("/pokemon-example"));

  assertEquals(response?.status, 200);
  assertEquals(
    response?.headers.get("Content-Type"),
    "text/html; charset=utf-8",
  );
  const html = await response!.text();
  assertStringIncludes(html, "<title>Pokémon Fart Example</title>");
  assertStringIncludes(html, "Pokeball");
});

Deno.test("serveDoc accepts trailing slashes and mixed case slugs", async () => {
  const trailing = await serveDoc(get("/pokemon-example/"));
  const mixed = await serveDoc(get("/Pokemon-Example"));

  assertEquals(trailing?.status, 200);
  assertEquals(mixed?.status, 200);
});

Deno.test("serveDoc returns null for unknown documents", async () => {
  assertEquals(await serveDoc(get("/does-not-exist")), null);
});

Deno.test("serveDoc only matches single-segment doc slugs", async () => {
  // Multi-segment paths belong to the compilation middleware, not docs.
  assertEquals(await serveDoc(get("/docs/pokemon-example")), null);
  assertEquals(await serveDoc(get("/ts/EthanThatOneKid/fart/main/ex")), null);
});

Deno.test("serveDoc does not escape the docs directory", async () => {
  assertEquals(await serveDoc(get("/..")), null);
  assertEquals(await serveDoc(get("/%2e%2e%2fREADME")), null);
});

Deno.test("serveDoc escapes HTML-significant characters in titles", async () => {
  const response = await serveDoc(get("/server-architecture"));
  const html = await response!.text();

  assertEquals(response?.status, 200);
  // The raw first heading is used verbatim, never as executable markup.
  assertStringIncludes(html, "<title>Fart Server 📡</title>");
});
