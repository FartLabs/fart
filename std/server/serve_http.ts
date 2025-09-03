import { handleRequest } from "./handle_request.ts";

export const serveHttp = async () => {
  console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);

  await Deno.serve({ port: 8080 }, async (request) => {
    return await handleRequest(request);
  });
};

if (import.meta.main) {
  await serveHttp();
}
