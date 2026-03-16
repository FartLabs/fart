import { assertEquals } from "@std/assert";
import { generateHtmlGhSyntax } from "./html_gh_syntax.ts";

Deno.test("html_gh_syntax generates highlighted HTML payload", () => {
  const code = `type A {\n  b: string\n}`;
  const html = generateHtmlGhSyntax(code);

  // Starts and ends with tbody wrapper
  assertEquals(html.startsWith("<tbody>\n"), true);
  assertEquals(html.endsWith("</tbody>"), true);

  // Highlights 'type', 'A', 'b', etc
  assertEquals(html.includes('<span class="pl-k">type</span>'), true);
  assertEquals(html.includes('<span class="pl-en">A</span>'), true);
  assertEquals(html.includes('<span class="pl-en">b</span>'), true);
  assertEquals(html.includes('<span class="pl-k">:</span>'), true);
  assertEquals(html.includes('<span class="pl-c1">string</span>'), true);

  // Checks rows were split via newline handling
  assertEquals(html.includes('<td id="L1"'), true);
  assertEquals(html.includes('<td id="L2"'), true);
  assertEquals(html.includes('<td id="L3"'), true);
});

Deno.test("html_gh_syntax preserves spaces and newlines", () => {
  const code = `type     B { }`;
  const html = generateHtmlGhSyntax(code);

  // Should have padding spaces reconstructed from token index offset differences
  assertEquals(
    html.includes(
      '<span class="pl-k">type</span>     <span class="pl-en">B</span> <span class="pl-k">{</span> <span class="pl-k">}</span>',
    ),
    true,
  );
});

Deno.test("html_gh_syntax highlights comments properly", () => {
  const code = `; user info\ntype User`;
  const html = generateHtmlGhSyntax(code);

  assertEquals(html.includes('<span class="pl-c">; user info</span>'), true);
});
