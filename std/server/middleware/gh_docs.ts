import {
  dirname,
  fromFileUrl,
  join,
  normalize,
} from "../../../deps/std/path.ts";
import { convertFilenameToTargetFilename } from "../../common.ts";

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
    await Deno.stat(docPath);
    return docPath;
    // deno-lint-ignore no-empty
  } catch {}
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
