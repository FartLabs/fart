import { getMimeType } from "../../common.ts";
import {
  dirname,
  fromFileUrl,
  join,
  normalize,
} from "../../../deps/std/path.ts";

const processPathname = (pathname: string): string => {
  // TODO: Do not check if --allow-env is unspecified.
  const deployed = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
  return fromFileUrl(
    normalize(join(
      (deployed
        ? "./std/server/static/"
        : join(dirname(import.meta.url), "../static/")),
      pathname,
    )),
  );
};

export default async (pathname: string): Promise<Response | undefined> => {
  try {
    const filename = processPathname(pathname);
    const file = await Deno.readFile(filename);
    return new Response(file, {
      headers: {
        "Content-Type": getMimeType(pathname),
      },
    });
    // deno-lint-ignore no-empty
  } catch {}
};
