import { GitHubDepartment } from "./github_department.ts";
import { assertEquals } from "../../../deps/std/testing.ts";

Deno.test("Initializes successfully", () => {
  const gh = new GitHubDepartment();
  console.log({ gh });
  assertEquals(1, 1);
});
