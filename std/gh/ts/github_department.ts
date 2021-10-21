import type {
  GitHubDepartment as iGitHubDepartment,
  GitHubRepo,
  GitHubUser,
} from "https://fart.tools/ts/EthanThatOneKid/fart/main/std/gh/gh.ts";

// Full Octokit docs: https://octokit.github.io/rest.js
import { Octokit } from "../../../deps/third_party/octokit/rest.ts";

/**
 * Library available via:
 * ```ts
 * import { GitHubDepartment } from "https://etok.codes/fart/raw/main/std/gh/mod.ts";
 * ```
 */
export class GitHubDepartment implements iGitHubDepartment {
  httpClient?: Octokit;

  authenticate(accessToken: string) {
    this.httpClient = new Octokit({
      auth: accessToken,
      baseUrl: "https://api.github.com",
    });
  }

  async getUser(username: string): Promise<GitHubUser> {
    console.log("USER", { username });
  }

  async getRepos(user: GitHubUser): Promise<GitHubRepo> {
    console.log("REPOS", { user });
  }
}
