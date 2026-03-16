import { redirectToDenoDeployPreviewUrl } from "./bonus_features/versions/mod.ts";
import { redirectIfShortlink } from "./bonus_features/shortlinks/mod.ts";
import { clear, getSize, inject, register } from "./utils.ts";

const middleware = [
  // redirect to another server running a different version of the Fart library
  redirectToDenoDeployPreviewUrl,
  // redirect to an external URL
  redirectIfShortlink,
  // show how many handlers are registered
  (request: Request) => {
    if (new URL(request.url).pathname === "/debug/size") {
      return new Response(String(getSize()));
    }
    return null;
  },
  // show deployment ID if running on Deno Deploy
  (request: Request) => {
    if (new URL(request.url).pathname === "/debug/deployment") {
      return new Response(String(Deno.env.get("DENO_DEPLOYMENT_ID")));
    }
    return null;
  },
];

export const setup = () => {
  if (getSize() === middleware.length) return;
  clear();
  register(...middleware);
};

export const handleRequest = async (request: Request) => {
  setup();
  return await inject(request);
};

export const serve = () => {
  const port = parseInt(Deno.env.get("PORT") || "8080");
  console.info(`Access HTTP webserver at: http://localhost:${port}/`);
  Deno.serve({ port }, async (request) => {
    setup();
    return await inject(request);
  });
};

if (Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined) {
  // add the fetch listener if running on Deno Deploy
  addEventListener(
    "fetch",
    (async (event: Event) => {
      const e = event as unknown as {
        request: Request;
        respondWith: (r: Response | Promise<Response>) => void;
      };
      e.respondWith(await handleRequest(e.request));
    }) as unknown as EventListenerOrEventListenerObject,
  );
} else if (import.meta.main) {
  // serve the HTTP server if running locally
  await serve();
}
