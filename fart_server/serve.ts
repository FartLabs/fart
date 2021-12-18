import { redirectToDenoDeployPreviewUrl } from "./bonus_features/versions/mod.ts";
import { redirectIfShortlink } from "./bonus_features/shortlinks/mod.ts";
import { getSize, inject, register } from "./utils.ts";

const middleware = [
  // redirect to another server running a different version of the Fart library
  redirectToDenoDeployPreviewUrl,
  // redirect to an external URL
  redirectIfShortlink,
  // show how many handlers are registered
  (request) => {
    if (new URL(request.url).pathname === "/debug/size") {
      return new Response(String(getSize()));
    }
    return null;
  },
  // show deployment ID if running on Deno Deploy
  (request) => {
    if (new URL(request.url).pathname === "/debug/deployment") {
      return new Response(String(Deno.env.get("DENO_DEPLOYMENT_ID")));
    }
    return null;
  },
];

export const setup = () => {
  if (getSize() === middlware.length) return;
  clear();
  register(...middleware);
};

export const handleRequest = async (event: Deno.RequestEvent) => {
  setup();
  event.respondWith(await inject(event.request));
};

export const serve = async () => {
  const port = parseInt(Deno.env.get("PORT") || "8080");
  console.log(`Access HTTP webserver at: http://localhost:${port}/`);
  for await (const connection of Deno.listen({ port })) {
    for await (const event of Deno.serveHttp(connection)) {
      await handleRequest(event);
    }
  }
};

if (Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined) {
  // add the fetch listener if running on Deno Deploy
  addEventListener(
    "fetch",
    handleRequest as unknown as EventListenerOrEventListenerObject,
  );
} else if (import.meta.main) {
  // serve the HTTP server if running locally
  await serve();
}
