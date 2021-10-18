import {
  dirname,
  fromFileUrl,
  join,
  normalize,
} from "../../../deps/std/path.ts";
import { marked as parse } from "../../../deps/third_party/marked.ts";
import { Time } from "../../../lib/consts/time.ts";
import { makeCacheLayer, removeFrontmatter } from "../common.ts";
import { convertFilenameToTargetFilename } from "../../common.ts";
import { Mime } from "../../common.ts";

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

const processUrl = (pathname: string, hash = "#readme"): string => {
  const BASE_URL = "https://etok.codes/fart/blob/main/docs/";
  const targetName = convertFilenameToTargetFilename(pathname, ".md");
  hash = hash !== undefined && hash.length > 0 ? hash : "#readme";
  return BASE_URL + targetName + hash;
};

const cache = makeCacheLayer(async (pathname: string) => {
  const doc = await fetchDoc(pathname);
  if (doc !== undefined) {
    const html = parse(doc);
    const ghLink = processUrl(pathname);
    return `<html>
  <head>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <main id="wrapper">
      <a href="${ghLink}" style="float: right;">
        <img src="fart-logo.png" alt="Fart Logo" style="width: 144px;" />
      </a>
      ${html}
    </main>
  </body>
</html>`;
  }
}, Time.Hour);

export default async (
  pathname: string,
): Promise<Response | undefined> => {
  try {
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
