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

/**
 * Extracts the source URL and the optional implementation file URL
 * from a Fart server request URL.
 */
export const parseFartUrl = (
  url: string | URL,
): { sourceUrl: string; implUrl?: string } => {
  const urlObj = typeof url === "string" ? new URL(url) : url;
  // Implementation files are specified after a tilde `~` in the URL pathname
  const delimiterIndex = urlObj.pathname.indexOf("~");

  if (delimiterIndex === -1) {
    return { sourceUrl: urlObj.pathname };
  }

  const sourceUrl = urlObj.pathname.slice(0, delimiterIndex);
  const implUrl = urlObj.pathname.slice(delimiterIndex + 1);
  return { sourceUrl, implUrl };
};
