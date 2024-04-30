import * as middleware from "./middleware/mod.ts";
import { makeError } from "./common.ts";

const getHash = (request: Request): string | undefined => {
  // The hash is not sent to the server, so we emulate the hash with searchParams :/
  const { searchParams } = new URL(request.url);
  const hash = [...searchParams].shift()?.shift();
  if (hash !== undefined) return "#" + hash;
};

export const handleRequest = async (request: Request): Promise<Response> => {
  const { pathname } = new URL(request.url);
  if (pathname === "/") return await middleware.home();
  if (request.method === "GET") {
    const staticFile = await middleware.static(pathname);
    if (staticFile !== undefined) return staticFile;
    const ghDoc = await middleware.gh_docs(
      pathname,
      /*hash=getHash(request),*/
    );
    if (ghDoc !== undefined) return ghDoc;
    return await middleware.compile(request);
  }
  return makeError("Requested an unknown resource.", 404);
};
