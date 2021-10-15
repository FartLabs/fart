import { getMimeType } from "../../common.ts";
import { makeCacheLayer } from "../common.ts";
import { Time } from "../../../lib/consts/time.ts";
import {
  dirname,
  fromFileUrl,
  join,
  normalize,
} from "../../../deps/std/path.ts";

const processPathname = (pathname: string): string => {
  // TODO: Do not check if --allow-env is unspecified.
  const deployed = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
  if (deployed) {
    return join("./std/server/static/", pathname);
  }
  return fromFileUrl(
    normalize(join(dirname(import.meta.url), "../static/", pathname)),
  );
};

const cache = makeCacheLayer(
  async (key: string) => await Deno.readFile(key),
  Time.Hour,
);

export default async (pathname: string): Promise<Response | undefined> => {
  try {
    const filename = processPathname(pathname);
    return new Response(await cache(filename), {
      headers: {
        "Content-Type": getMimeType(pathname),
      },
    });
    // deno-lint-ignore no-empty
  } catch {}
};
