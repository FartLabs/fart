import { marked } from "marked";

/**
 * @param url ex: <https://etok.codes/fart/blob/main/docs/pokemon-example.md>
 * @returns raw HTML of parsed documentation found on <https://etok.codes/fart/>
 */
export const fetchGitHubDoc = async (url: string): Promise<string> => {
  const rawUrl = url.replace("github.com", "raw.githubusercontent.com").replace(
    "/blob/",
    "/",
  );
  const response = await fetch(rawUrl);
  if (!response.ok) return "";
  const markdown = await response.text();
  return marked(markdown);
};
