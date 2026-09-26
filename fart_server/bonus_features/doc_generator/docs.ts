import { marked } from "marked";

/**
 * Restores the docs routes that existed on Fart Server before the #34 rework.
 *
 * Historically `GET /` rendered the repository README and `GET /{slug}`
 * rendered the matching `docs/{slug}.md` file, both through `marked`.
 */

/** Matches a `/` terminated single-segment doc slug, e.g. `/pokemon-example/`. */
const docSlugPattern = /^\/([a-z0-9][a-z0-9-]*)\/?$/i;

/**
 * Resolves the repository root relative to this module so docs can be read
 * both from a checkout and from a Deno Deploy deployment bundle.
 */
const repositoryRoot = new URL("../../..", import.meta.url);

const textDecoder = new TextDecoder("utf-8");

/**
 * Reads a UTF-8 file relative to the repository root, returning `undefined`
 * when it does not exist so the request can fall through to other middleware.
 */
const readRepoFile = async (
  relativePath: string,
): Promise<string | undefined> => {
  try {
    const contents = await Deno.readFile(new URL(relativePath, repositoryRoot));
    return textDecoder.decode(contents);
    // deno-lint-ignore no-empty
  } catch {}
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/**
 * Derives a page title from the first markdown heading, falling back to a
 * generic title for documents without one.
 */
const deriveTitle = (markdown: string, fallback: string): string => {
  const heading = markdown.match(/^#\s+(.+)$/m);
  return heading ? escapeHtml(heading[1].trim()) : escapeHtml(fallback);
};

const page = async (
  title: string,
  body: string | Promise<string>,
): Promise<Response> =>
  new Response(
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body {
        margin: 0 auto;
        max-width: 45rem;
        padding: 2rem 1rem 4rem;
        font-family: ui-sans-serif, system-ui, sans-serif;
        line-height: 1.6;
      }
      pre {
        overflow-x: auto;
        padding: 0.75rem;
        background: #f4f4f5;
        border-radius: 0.375rem;
      }
      img { max-width: 100%; }
    </style>
  </head>
  <body>
    <main>
${await body}
    </main>
  </body>
</html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );

/**
 * Route handler that serves the repository README at the site root.
 * Example URL: /
 */
export const serveReadme = async (
  request: Request,
): Promise<Response | null> => {
  const { pathname } = new URL(request.url);
  if (pathname !== "/") return null;

  const readme = await readRepoFile("README.md");
  if (readme === undefined) return null;

  return await page(deriveTitle(readme, "Fart"), marked(readme));
};

/**
 * Route handler that serves a rendered document from `docs/`.
 * Example URL: /pokemon-example
 */
export const serveDoc = async (
  request: Request,
): Promise<Response | null> => {
  const { pathname } = new URL(request.url);
  const slug = docSlugPattern.exec(pathname);
  if (slug === null) return null;

  const doc = await readRepoFile(`docs/${slug[1]}.md`);
  if (doc === undefined) return null;

  return await page(deriveTitle(doc, slug[1]), marked(doc));
};
