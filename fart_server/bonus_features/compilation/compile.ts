import { parseFartUrl } from "../../../fart_server/utils.ts";
import { transpile } from "../../../lib/transpile/transpile.ts";
import { generateTypeScriptCartridge } from "../../../lib/transpile/cartridge/ts_cartridge.ts";
import { generateHtmlGhSyntax } from "../../../lib/transpile/cartridge/html_gh_syntax.ts";

/**
 * Route handler for runtime transpilation.
 * Example URL: /deno.cli/EthanThatOneKid/fart/main/ex/pokemon/pokemon.fart~path/to/impl.ts
 */
export const compileFartToTs = async (
  request: Request,
): Promise<Response | null> => {
  const url = new URL(request.url);

  const isTsRoute = url.pathname.startsWith("/deno.cli/") ||
    url.pathname.startsWith("/ts/");
  const isHtmlSyntaxRoute = url.pathname.startsWith("/html.syntax.gh/");

  // Match `/deno.cli/`, `/ts/`, or `/html.syntax.gh/` URL routing.
  if (isTsRoute || isHtmlSyntaxRoute) {
    const { sourceUrl, implUrl } = parseFartUrl(url);

    // Parse the endpoint suffix to fetch the raw source code
    const rawPath = sourceUrl.replace(
      /^\/(?:deno\.cli|ts|html\.syntax\.gh)\//,
      "",
    );

    // Let's resolve the raw URL. If it's github format (User/Repo/Branch/Path):
    // e.g. EthanThatOneKid/fart/main/ex/pokemon/pokemon.fart
    const rawUrl = `https://raw.githubusercontent.com/${rawPath}`;

    try {
      const response = await fetch(rawUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Fart source code: ${response.statusText}`,
        );
      }

      const sourceCode = await response.text();

      if (isHtmlSyntaxRoute) {
        // Issue #26 functionality
        const htmlPayload = generateHtmlGhSyntax(sourceCode);
        return new Response(htmlPayload, {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      const codeCartridge = generateTypeScriptCartridge({ implFile: implUrl });

      // Transpile Fart into TypeScript
      const tsCode = await transpile(sourceCode, {
        codeCartridge,
        targetLanguage: "ts",
        sourceLanguage: "fart",
        indentation: 2,
        preserveComments: true,
        implFile: implUrl,
      });

      return new Response(tsCode, {
        status: 200,
        headers: {
          "Content-Type": "application/typescript",
          // Permissive CORS to allow client-side/Deno imports
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return new Response(`Error Transpiling: ${e.message}`, { status: 500 });
      }
      return new Response(`Error Transpiling: ${String(e)}`, { status: 500 });
    }
  }

  return null;
};
