import { handleRequest } from "./handle_request.ts";

addEventListener("fetch", async (event) => {
  const response = await handleRequest(event.request);
  event.respondWith(response);
});
