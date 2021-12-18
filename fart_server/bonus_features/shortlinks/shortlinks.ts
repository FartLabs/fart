// TODO(@ethanthatonekid): write implementation for shortlinks.test.ts
import shortlinks from "./shortlinks.json" assert { type: "json" };

const map = Object.entries(shortlinks)
  .reduce((result, [key, value]) => {
    result.set(key, value);
    return result;
  }, new Map<string, string>());

export const redirectIfShortlink = (request: Request): Response | null => {
  const { pathname } = new URL(request.url);
  if (pathname.includes("?")) {
    const query = pathname.slice(pathname.indexOf("?"));
    const shortlink = map.get(pathname.slice(0, pathname.indexOf("?")));
    if (shortlink !== undefined) return Response.redirect(shortlink + query);
  }
  const shortlink = map.get(pathname.replace(/([^:]\/)\/+/g, "/"));
  if (shortlink !== undefined) return Response.redirect(shortlink);
  return null;
};
