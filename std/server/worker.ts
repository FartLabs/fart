import { handleRequest } from "./handle-request.ts";

addEventListener("fetch", async (event) => {
  const response = await handleRequest(event.request);
  event.respondWith(response);
});
