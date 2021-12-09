// TODO: Move to fart_server/worker.ts on
// https://dash.deno.com/projects/fart/settings/git

import { handleRequest } from "../../fart_server/handle_request.ts";

addEventListener("fetch", async (event) => {
  const response = await handleRequest(event.request);
  event.respondWith(response);
});
