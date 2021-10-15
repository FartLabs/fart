import {
  dirname,
  fromFileUrl,
  join,
  normalize,
} from "../../../deps/std/path.ts";
import { marked as parse } from "../../../deps/third_party/marked.ts";
import { Time } from "../../../lib/consts/time.ts";
import { makeCacheLayer } from "../common.ts";
import { convertFilenameToTargetFilename } from "../../common.ts";
import { Mime } from "../../common.ts";

const removeFrontmatter = (md: string) =>
  md.replace(/^\-\-\-[\r\n]*(.*?)[\r\n]*\-\-\-/g, "");

const fetchDoc = async (pathname: string): Promise<string | undefined> => {
  // TODO: Do not check if --allow-env is unspecified.
  const deployed = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
  const targetName = convertFilenameToTargetFilename(pathname, ".md");
  const docPath = deployed ? join("./docs/", targetName) : fromFileUrl(
    normalize(
      join(
        dirname(import.meta.url),
        "../../../docs/",
        targetName,
      ),
    ),
  );
  try {
    const decoder = new TextDecoder("utf-8");
    const docFile = await Deno.readFile(docPath);
    return removeFrontmatter(decoder.decode(docFile));
    // deno-lint-ignore no-empty
  } catch {}
};

// const processUrl = (pathname: string, hash?: string): string => {
//   const BASE_URL = "https://etok.codes/fart/blob/main/docs/";
//   const targetName = convertFilenameToTargetFilename(pathname, ".md");
//   hash = hash !== undefined && hash.length > 0 ? hash : "#readme";
//   return join(BASE_URL + targetName) + hash;
// };

const cache = makeCacheLayer(async (pathname: string) => {
  const doc = await fetchDoc(pathname);
  if (doc !== undefined) {
    const html = parse(doc);
    return `<html>
  <head>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <main id="wrapper">
      <img src="/fart-logo.png" alt="Fart Logo" style="float: right; width: 144px;" />
      ${html}
    </main>
  </body>
</html>`;
  }
}, Time.Hour);

export default async (
  pathname: string,
  hash?: string,
): Promise<Response | undefined> => {
  try {
    console.log(hash);
    const result = await cache(pathname);
    if (result !== undefined) {
      return new Response(result, {
        status: 200,
        headers: { "Content-Type": Mime.HTML },
      });
    }
  } // deno-lint-ignore no-empty
  catch {}
};
