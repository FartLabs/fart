import { makeError } from "./common.ts";
import * as routes from "./routes/mod.ts";

export const handleRequest = async (request: Request): Promise<Response> => {
  const { pathname } = new URL(request.url);
  if (pathname === "/") return routes.home();
  if (request.method === "GET") {
    return await routes.compile(request);
  }
  return makeError("Requested an unknown resource.", 404);
};
