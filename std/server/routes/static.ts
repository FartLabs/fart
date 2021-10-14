import { getMimeType } from "../../common.ts";
import {
  dirname,
  fromFileUrl,
  join,
  normalize,
} from "../../../deps/std/path.ts";

export default async (pathname: string): Promise<Response | undefined> => {
  try {
    const filename = fromFileUrl(normalize(
      join(dirname(import.meta.url), "../static/", pathname),
    ));
    const file = await Deno.readFile(filename);
    return new Response(file, {
      headers: {
        "Content-Type": getMimeType(pathname),
      },
    });
    // deno-lint-ignore no-empty
  } catch (e) {
    console.log({ e });
  }
};
