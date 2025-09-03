import { GitHubDepartment } from "./github_department.ts";
import { assertEquals } from "@std/assert";

Deno.test("Initializes successfully", () => {
  const gh = new GitHubDepartment();
  assertEquals(gh.httpClient, undefined);
});
