import { Mime } from "../common.ts";

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
