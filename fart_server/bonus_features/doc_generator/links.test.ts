import { assertEquals } from "@std/assert";
import { rewriteLink, rewriteLinks, stripFrontMatter } from "./links.ts";

const unchanged = (href: string) => assertEquals(rewriteLink(href), undefined);

Deno.test("rewriteLink rewrites self doc links to server routes", () => {
  assertEquals(
    rewriteLink(
      "https://github.com/EthanThatOneKid/fart/blob/main/docs/pokemon-example.md",
    ),
    "/pokemon-example",
  );
  assertEquals(
    rewriteLink(
      "https://github.com/FartLabs/fart/blob/main/docs/architecture.md",
    ),
    "/architecture",
  );
  assertEquals(
    rewriteLink("https://github.com/FartLabs/fart/blob/main/README.md"),
    "/",
  );
  assertEquals(
    rewriteLink(
      "https://github.com/FartLabs/fart/blob/master/docs/getting-started.md",
    ),
    "/getting-started",
  );
});

Deno.test("rewriteLink leaves non-doc repository paths pointing at GitHub", () => {
  // There is no server route that renders these as pages.
  unchanged(
    "https://github.com/EthanThatOneKid/fart/blob/main/ex/pokemon/mod.fart",
  );
  unchanged("https://github.com/FartLabs/fart/blob/main/ex/pokemon/run.ts");
});

Deno.test("rewriteLink ignores other repositories and branches", () => {
  unchanged("https://github.com/denoland/deno/blob/main/docs/runtime.md");
  unchanged("https://github.com/FartLabs/fartlabs.org/blob/main/docs/x.md");
  unchanged("https://github.com/FartLabs/fart/blob/develop/docs/x.md");
});

Deno.test("rewriteLink leaves anchors, relative, and root-relative links alone", () => {
  unchanged("#section");
  unchanged("./relative.md");
  unchanged("/already/relative");
  unchanged("mailto:someone@example.com");
  unchanged("");
});

Deno.test("rewriteLink promotes raw=true blob URLs to the raw host", () => {
  assertEquals(
    rewriteLink(
      "https://github.com/EthanThatOneKid/fart/blob/main/std/server/static/pokemon-example-stdout.png?raw=true",
    ),
    "https://raw.githubusercontent.com/EthanThatOneKid/fart/main/std/server/static/pokemon-example-stdout.png",
  );
  // `&raw=true` on a URL that already has a query string.
  assertEquals(
    rewriteLink(
      "https://github.com/FartLabs/fart/blob/main/img/x.png?raw=true&foo=1",
    ),
    "https://raw.githubusercontent.com/FartLabs/fart/main/img/x.png?foo=1",
  );
});

Deno.test("rewriteLink does not rewrite other domains", () => {
  unchanged("https://deno.com/blog");
  unchanged("https://example.com/github.com/fart/blob/main/docs/x.md");
  unchanged("https://raw.githubusercontent.com/FartLabs/fart/main/docs/x.md");
});

Deno.test("rewriteLinks rewrites href and src in rendered HTML", () => {
  const html = rewriteLinks(
    `<a href="https://github.com/FartLabs/fart/blob/main/docs/pokemon-example.md">example</a>` +
      `<img src="https://github.com/FartLabs/fart/blob/main/a.png?raw=true" />` +
      `<a href="https://github.com/denoland/deno/blob/main/docs/runtime.md">deno</a>` +
      `<a href="#local">local</a>`,
  );

  assertEquals(
    html,
    `<a href="/pokemon-example">example</a>` +
      `<img src="https://raw.githubusercontent.com/FartLabs/fart/main/a.png" />` +
      `<a href="https://github.com/denoland/deno/blob/main/docs/runtime.md">deno</a>` +
      `<a href="#local">local</a>`,
  );
});

Deno.test("rewriteLinks leaves HTML without links untouched", () => {
  const html = "<h1>Title</h1>\n<p>No links here.</p>\n";
  assertEquals(rewriteLinks(html), html);
});

Deno.test("stripFrontMatter removes the self_link declaration", () => {
  // The blank line separating front matter from the body is preserved.
  assertEquals(
    stripFrontMatter(
      "---\nself_link: https://fart.fart.tools/pokemon-example\n---\n\n# Hi\n",
    ),
    "\n# Hi\n",
  );
  // CRLF line endings.
  assertEquals(
    stripFrontMatter("---\r\nself_link: https://x\r\n---\r\n\r\n# Hi\r\n"),
    "\r\n# Hi\r\n",
  );
  // Multiple keys.
  assertEquals(
    stripFrontMatter("---\na: 1\nb: 2\n---\nbody\n"),
    "body\n",
  );
});

Deno.test("stripFrontMatter leaves documents without front matter alone", () => {
  assertEquals(stripFrontMatter("# Hi\n"), "# Hi\n");
  // A thematic break later in the document is not front matter.
  assertEquals(
    stripFrontMatter("# Hi\n\n---\n\nmore\n"),
    "# Hi\n\n---\n\nmore\n",
  );
  // Unterminated front matter is left alone rather than eating the document.
  assertEquals(
    stripFrontMatter("---\nself_link: x\n\n# Hi\n"),
    "---\nself_link: x\n\n# Hi\n",
  );
});
