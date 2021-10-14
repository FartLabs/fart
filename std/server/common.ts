export enum Mime {
  TypeScript = "application/typescript; charset=UTF-8",
  JSON = "application/json; charset=UTF-8",
  HTML = "text/html; charset=UTF-8",
  CSS = "text/css; charset=UTF-8",
  Plain = "text/plain; charset=UTF-8",
  PNG = "image/png",
}

export const getMimeType = (pathname: string): Mime =>
  pathname.endsWith(".css")
    ? Mime.CSS
    : pathname.endsWith(".html")
    ? Mime.HTML
    : pathname.endsWith(".json")
    ? Mime.JSON
    : pathname.endsWith(".ts")
    ? Mime.TypeScript
    : pathname.endsWith(".png")
    ? Mime.PNG
    : Mime.Plain;

export const makeError = (message: string, status = 400): Response =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": Mime.JSON },
  });

const transformPathname = (pathname: string) =>
  pathname.replace(/\.[^.]*$/, "") + ".fart";

export const fetchGitHubFile = async (pathname: string, transform = false) => {
  try {
    const GITHUB_BASE = "https://raw.githubusercontent.com/";
    const url = GITHUB_BASE +
      (transform ? transformPathname(pathname) : pathname);
    const response = await fetch(url);
    return await response.text();
  } catch {
    return undefined;
  }
};
