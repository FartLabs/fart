// deno-lint-ignore-file

/**
 * Routes a given HTTP request to the intended `bonus_features` and
 * sets the appropriate content type header.
 * @param request incoming http request
 * @returns routed Fart server response
 */
export const route = async (request: Request): Promise<Response> => {
  // TODO(@ethanthatonekid): double-check proper index checking
  const isIndex = request.url.length === 0 || request.url === "/";
  return Response.redirect("/");
};
