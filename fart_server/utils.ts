export type Result = null | Response | Promise<null | Response>;

export type RequestHandler = (r: Request) => Result;

/**
 * In-memory storage of the Fart Server's configuration.
 */
const handlers: RequestHandler[] = [];

/**
 * Routes a given HTTP request to the intended `bonus_features` and
 * sets the appropriate content type header.
 * @param request incoming http request
 * @returns routed Fart server response
 */
export const inject = async (request: Request): Promise<Response> => {
  for (const handler of handlers) {
    const result = await handler(request);
    if (result !== null) {
      return result;
    }
  }
  return new Response("404", { status: 404 });
};

export const register = (...gimmeHandlers: RequestHandler[]) => {
  handlers.push(...gimmeHandlers);
};

export const clear = () => {
  handlers.length = 0;
};

export const getSize = () => {
  return handlers.length;
};

// TODO(@ethanthatonekid): Write new functions to access the Fart Server's
// configuration.
