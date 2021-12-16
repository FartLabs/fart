// import {
//   fetchDenoDoc,
//   fetchGitHubDoc,
// } from "./bonus_features/doc_generator/mod.ts";
import { redirectToDenoDeployPreviewUrl } from "./bonus_features/versions/mod.ts";
import { matchHome, matchSubroute, register, route } from "./utils.ts";

/**
 * This function handles any request sent to the Fart server. This includes
 * custom routing, and more.
 * @todo @ethanthatonekid fledge out the rest of the features
 */
export const handleRequest = async (request: Request): Promise<Response> => {
  const versionRedirection = await redirectToDenoDeployPreviewUrl(request);
  if (versionRedirection !== null) return versionRedirection;
  return new Response("Hello World");
};
