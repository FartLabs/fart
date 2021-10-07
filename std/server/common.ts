export enum Mime {
  TypeScript = "application/typescript; charset=UTF-8",
  JSON = "application/json; charset=UTF-8",
}

export const makeError = (message: string, status = 400): Response =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": Mime.JSON },
  });
