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

// TODO: Allow user-defined `getSize` function to help calculate the size
// of a given cache item. That way we can start removing some entries once
// we reach a given threshold.
export const makeCacheLayer = <T>(
  download: (k: string) => Promise<T>,
  expirationTimeout: number,
) => {
  const cache = new Map<
    string,
    { value: T; lastUpdated: number }
  >([]);
  return async (key = "", currentTimestamp = new Date().valueOf()) => {
    const cacheEntry = cache.get(key);
    if (
      cacheEntry !== undefined &&
      cacheEntry.lastUpdated + expirationTimeout > currentTimestamp
    ) {
      return cacheEntry.value;
    }
    const updatedEntry = {
      value: await download(key),
      lastUpdated: currentTimestamp,
    };
    cache.set(key, updatedEntry);
    return updatedEntry.value;
  };
};

export const removeFrontmatter = (md: string) =>
  md.replace(/^\-\-\-[\r\n]*(.*?)[\r\n]*\-\-\-/g, "");
