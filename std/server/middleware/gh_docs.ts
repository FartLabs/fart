import {
  dirname,
  fromFileUrl,
  join,
  normalize,
} from "../../../deps/std/path.ts";
import { exists } from "../../../deps/std/fs.ts";
import { convertFilenameToTargetFilename } from "../../common.ts";

const fetchDoc = async (pathname: string): Promise<string | undefined> => {
  // TODO: Do not check if --allow-env is unspecified.
  const deployed = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
  const docPath = deployed
    ? join("./docs/", convertFilenameToTargetFilename(pathname, ".md"))
    : fromFileUrl(
      normalize(
        join(
          dirname(import.meta.url),
          "../../../docs/",
          convertFilenameToTargetFilename(pathname, ".md"),
        ),
      ),
    );
  const docExists = await exists(docPath);
  if (docExists) return docPath;
};

const processUrl = (pathname: string, hash?: string): string => {
  console.log({ hash });
  hash = hash !== undefined && hash.length > 0 ? hash : "#readme";
  const BASE_URL = "https://etok.codes/fart/blob/main/docs/";
  return join(BASE_URL + convertFilenameToTargetFilename(pathname, ".md")) +
    hash;
};

export default async (
  pathname: string,
  hash?: string,
): Promise<Response | undefined> => {
  try {
    const docPath = await fetchDoc(pathname);
    if (docPath !== undefined) {
      const redirectUrl = processUrl(pathname, hash);
      return Response.redirect(redirectUrl, 302);
    }
    // deno-lint-ignore no-empty
  } catch {}
};
