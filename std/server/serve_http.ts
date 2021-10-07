import { handleRequest } from "./handle_request.ts";

export const serveHttp = async () => {
  const server = Deno.listen({ port: 8080 });
  console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
  // Connections to the server will be yielded up as an async iterable.
  for await (const connection of server) {
    // In order to not be blocking, we need to handle each connection individually
    // without awaiting the function.
    for await (const event of Deno.serveHttp(connection)) {
      const { request, respondWith } = event;
      respondWith(await handleRequest(request));
    }
  }
};

if (import.meta.main) {
  await serveHttp();
}
