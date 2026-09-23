import { Time } from "../../../lib/constants/time.ts";

const deployments = new Map<string, string>();
const projectName = Deno.env.get("DENO_DEPLOY_PROJECT_NAME") ?? "fart";
const token = Deno.env.get("DENO_DEPLOY_ACCESS_TOKEN");
const refreshRate = 10 * Time.Minute;
let lastFetch = -1;

const fetchAllDeployments = async (
  projectName: string,
  accessToken: string,
  limit = 20,
): Promise<void> => {
  let currentPage = 0;
  let totalPages = Infinity;

  const canFetchMore = lastFetch + refreshRate < Date.now();
  while (canFetchMore && currentPage < totalPages - 1) {
    // Deno Deploy Classic was retired on 2026-07-20 and this endpoint no longer
    // serves deployment listings, so treat any failure as "no versions known"
    // instead of failing every request.
    const response = await fetch(
      `https://dash.deno.com/api/projects/${projectName}/deployments?page=${currentPage}&limit=${limit}`,
      { headers: { "Authorization": `Bearer ${accessToken}` } },
    );
    if (!response.ok) {
      console.warn(
        `version redirects disabled: ${response.status} from ${response.url}`,
      );
      deployments.clear();
      break;
    }
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      console.warn("version redirects disabled: response was not JSON");
      deployments.clear();
      break;
    }
    const [incomingDeployments, pageInfo] = Array.isArray(payload)
      ? payload
      : [];
    if (!Array.isArray(incomingDeployments) || !pageInfo) {
      console.warn("version redirects disabled: unexpected response shape");
      deployments.clear();
      break;
    }
    incomingDeployments.forEach(
      (deployment: { id: string; relatedCommit: { hash: string } }) => {
        const previewUrl = `https://${projectName}-${deployment.id}.deno.dev`;
        const validIds = [
          deployment.id,
          deployment.relatedCommit.hash,
          deployment.relatedCommit.hash.slice(0, 7),
        ];
        for (const id of validIds) {
          deployments.set(id, previewUrl);
        }
      },
    );
    currentPage = pageInfo.page + 1;
    totalPages = pageInfo.totalPages;
  }
  lastFetch = Date.now();
};

/**
 * This handler redirects the request to the correct Deno deployment.
 * last updated: 12-08-2021
 */
export const redirectToDenoDeployPreviewUrl = async (
  request: Request,
): Promise<Response | null> => {
  const url = new URL(request.url);
  const [, versionHash] = url.pathname.split("/");
  if (projectName === undefined) return null;
  if (token === undefined) return null;
  await fetchAllDeployments(projectName, token);
  const deployment = deployments.get(versionHash);
  if (deployment === undefined) return null;
  return Response.redirect(deployment);
};
