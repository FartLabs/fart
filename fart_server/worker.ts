import { setRepoFileReader } from "./bonus_features/doc_generator/mod.ts";
import { handleRequest } from "./serve.ts";

/** The subset of the Workers static assets binding that the server uses. */
interface Env {
  ASSETS: { fetch(input: Request | URL | string): Promise<Response> };
}

/**
 * Cloudflare Workers entrypoint for Fart Server.
 *
 * Workers have no file system, so `devops/build_worker.ts` ships `README.md`
 * and `docs/` as static assets under `/_repo/`, and docs are read from there.
 */
export default {
  fetch(request: Request, env: Env): Promise<Response> {
    setRepoFileReader(async (relativePath) => {
      const response = await env.ASSETS.fetch(
        new URL(`/_repo/${relativePath}`, request.url),
      );
      return response.ok ? await response.text() : undefined;
    });
    return handleRequest(request);
  },
};
