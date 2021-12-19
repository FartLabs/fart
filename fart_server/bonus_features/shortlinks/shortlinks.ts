import shortlinks from "./shortlinks.json" assert { type: "json" };

const map = Object.entries(shortlinks)
  .reduce((result, [key, value]) => {
    result.set(key, value);
    return result;
  }, new Map<string, string>());

export const redirectIfShortlink = (request: Request): Response | null => {
  const { pathname, searchParams } = new URL(request.url);
  for (const [shortlink, target] of map) {
    if (pathname.startsWith(shortlink)) {
      let destination = target + pathname.slice(shortlink.length);
      if (searchParams.toString()) destination += "?" + searchParams;
      // add a slash if the destination doesn't end with one
      else if (!destination.endsWith("/")) destination += "/";
      return Response.redirect(destination, 302);
    }
  }
  return null;
};
