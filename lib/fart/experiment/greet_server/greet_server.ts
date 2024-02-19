import { DEFAULT_NAME, greet } from "../greet/mod.ts";

export function handle(r: Request) {
  const url = new URL(r.url);
  const name = url.searchParams.get("name") ?? DEFAULT_NAME;
  return new Response(greet(name));
}

export function serve(o: Deno.ServeOptions | Deno.ServeTlsOptions) {
  return Deno.serve(o, (r) => handle(r));
}
