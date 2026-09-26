/**
 * Rewrites absolute GitHub links in rendered documentation HTML so pages work
 * both on github.com and when served by Fart Server.
 *
 * This is a pure function with no filesystem or network access so it can be
 * unit tested directly.
 */

/** Repository owners whose links are considered "ours" and get rewritten. */
const selfOwners = new Set(["fartlabs", "ethanthatonekid"]);

/** The repository this server ships documentation for. */
const selfRepo = "fart";

/** Where blob URLs for this repository are rendered. */
const selfBranches = new Set(["main", "master"]);

/**
 * Matches an absolute `github.com/{owner}/{repo}/blob/{branch}/{path}` URL,
 * capturing the owner, repo, branch, and remaining path.
 */
const blobUrlPattern =
  /^https?:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/;

/** Matches the `?raw=true` query GitHub uses to serve a blob's raw bytes. */
const rawQueryPattern = /[?&]raw=true/;

/**
 * Rewrites links to this repository's own docs into server-rendered routes,
 * so a doc that links to another doc stays on the server.
 */
const rewriteSelfBlobUrl = (
  _owner: string,
  repo: string,
  _branch: string,
  path: string,
): string | undefined => {
  if (repo.toLowerCase() !== selfRepo) return undefined;

  const cleanPath = path.split(/[?#]/)[0];

  // README.md and docs/*.md are served by the doc routes.
  if (cleanPath === "README.md") return "/";
  const docMatch = /^docs\/(.+)\.md$/i.exec(cleanPath);
  if (docMatch !== null) return `/${docMatch[1]}`;

  // Anything else (examples, source farts) keeps pointing at GitHub, because
  // the server has no route that renders it as a page.
  return undefined;
};

/**
 * Converts a blob URL that asked for raw bytes into the canonical
 * `raw.githubusercontent.com` form, preserving any other query parameters.
 */
const toRawUrl = (href: string): string => {
  const url = new URL(href);
  url.searchParams.delete("raw");
  return url.href.replace(
    "https://github.com/",
    "https://raw.githubusercontent.com/",
  ).replace("/blob/", "/");
};

/**
 * Rewrites a single `href`/`src` value.
 *
 * Returns the rewritten value, or `undefined` when the link should be left
 * exactly as authored.
 */
export const rewriteLink = (href: string): string | undefined => {
  // Anchors, relative links, and non-HTTP schemes are already portable.
  if (href === "" || href.startsWith("#") || href.startsWith("/")) {
    return undefined;
  }
  if (!/^https?:\/\//i.test(href)) return undefined;

  // `?raw=true` on a blob URL is a request for raw bytes: for images this is
  // the correct way to display them, so promote it to the canonical raw host.
  if (rawQueryPattern.test(href)) return toRawUrl(href);

  const blobMatch = blobUrlPattern.exec(href);
  if (blobMatch === null) return undefined;

  const [, owner, repo, branch, path] = blobMatch;
  if (!selfOwners.has(owner.toLowerCase())) return undefined;
  if (!selfBranches.has(branch.toLowerCase())) return undefined;

  return rewriteSelfBlobUrl(owner, repo, branch, path);
};

/** Applies {@link rewriteLink} to every `href`/`src` in a rendered page. */
export const rewriteLinks = (html: string): string =>
  html.replace(
    /\b(href|src)="([^"]*)"/g,
    (match, attribute: string, value: string) => {
      const rewritten = rewriteLink(value);
      return rewritten === undefined ? match : `${attribute}="${rewritten}"`;
    },
  );

/**
 * Strips a leading `---` delimited YAML front matter block.
 *
 * The docs declare `self_link` front matter that is metadata for the old
 * server, not content to display.
 */
export const stripFrontMatter = (markdown: string): string =>
  markdown.replace(/^---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, "");
