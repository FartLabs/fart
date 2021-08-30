import { handle } from "./lib/handle.ts";

addEventListener("fetch", async (event) => {
  event.respondWith(await handle(event.request));
});
