export type MatchingFunction = (r: Request) => boolean;
export type RequestHandler = (r: Request) => Response | Promise<Response>;

export type Route = [MatchingFunction, RequestHandler];

/**
 * In-memory storage of the Fart Server's configuration.
 */
const routes: Route[] = [];

/**
 * Routes a given HTTP request to the intended `bonus_features` and
 * sets the appropriate content type header.
 * @param request incoming http request
 * @returns routed Fart server response
 */
export const route = async (request: Request): Promise<Response> => {
  for (const [match, handler] of routes) {
    if (match(request)) {
      return await handler(request);
    }
  }
  return new Response("404", { status: 404 });
};

export const register = (
  matchRoute: MatchingFunction,
  handler: RequestHandler,
) => {
  routes.push([matchRoute, handler]);
};

export const matchHome = (r: Request): boolean => {
  return new URL(r.url).pathname === "/";
};

export const matchSubroute = (subroute: string) => {
  return (r: Request): boolean => {
    return new URL(r.url).pathname === subroute;
  };
};
