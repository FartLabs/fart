import * as routes from "./routes/mod.ts";
import { makeError } from "./common.ts";

export const handleRequest = async (request: Request): Promise<Response> => {
  const { pathname } = new URL(request.url);
  if (pathname === "/") return await routes.home();
  if (request.method === "GET") {
    const staticFile = await routes.static(pathname);
    if (staticFile !== undefined) return staticFile;
    return await routes.compile(request);
  }
  return makeError("Requested an unknown resource.", 404);
};
