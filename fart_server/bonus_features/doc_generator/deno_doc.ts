/**
 * @param url ex: <https://deno.land/x/fart@v0.1/lib/fart.ts>
 * @returns raw HTML generated from [`deno doc`](https://deno.land/manual@v1.16.3/tools/documentation_generator)
 */
export const fetchDenoDoc = async (url: string): Promise<string> => {
  const reqUrl = `https://doc.deno.land/${url.replace("https://", "https/")}`;
  const response = await fetch(reqUrl);
  if (!response.ok) return "";
  return await response.text();
};
