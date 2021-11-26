// deno-lint-ignore-file

import {
  fetchDenoDoc,
  fetchGitHubDoc,
} from "./bonus_features/doc_generator/mod.ts";

/**
 * This function handles any request sent to the Fart server. This includes
 * custom routing, and more.
 * @todo @ethanthatonekid fledge out the rest of the features
 */
export const handleRequest = async (request: Request): Promise<Response> => {
  return Response.redirect("/");
};
