/// <reference lib="webworker" />
import { handleRequest } from "./handle_request.ts";

addEventListener("fetch", async (event) => {
  const fetchEvent = event as FetchEvent;
  const response = await handleRequest(fetchEvent.request);
  fetchEvent.respondWith(response);
});
