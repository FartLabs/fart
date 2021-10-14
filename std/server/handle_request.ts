import * as middleware from "./middleware/mod.ts";
import { makeError } from "./common.ts";

export const handleRequest = async (request: Request): Promise<Response> => {
  const { pathname } = new URL(request.url);
  if (pathname === "/") return await middleware.home();
  if (request.method === "GET") {
    const staticFile = await middleware.static(pathname);
    if (staticFile !== undefined) return staticFile;
    return await middleware.compile(request);
  }
  return makeError("Requested an unknown resource.", 404);
};
