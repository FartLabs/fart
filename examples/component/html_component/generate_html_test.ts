import { assertEquals } from "../developer_deps.ts";
import { generateHTML } from "./generate_html.ts";

Deno.test("generateHTML", () => {
  assertEquals(
    generateHTML({
      type: "html",
      children: [
        {
          type: "head",
          children: [
            {
              type: "title",
              children: ["Hello, World!"],
            },
          ],
        },
        {
          type: "body",
          children: [
            {
              type: "h1",
              children: ["Hello, World!"],
            },
            {
              type: "p",
              children: ["This is a paragraph."],
            },
          ],
        },
      ],
    }),
    "<html><head><title>Hello, World!</title></head><body><h1>Hello, World!</h1><p>This is a paragraph.</p></body></html>",
  );
});
