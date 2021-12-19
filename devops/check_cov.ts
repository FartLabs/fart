/**
 * Name: check_cov.ts
 * Author: EthanThatOneKid
 * Description: This script checks the coverage of the codebase.
 *
 * Handy Commands:
 * - Generate cov: deno test lib --coverage=cov_profile & deno coverage cov_profile --lcov > cov_profile.lcov
 * - Check cov: deno run --allow-read --unstable devops/check_cov.ts
 * - Visualize cov: deno coverage cov_profile
 */

import { source as parseFile } from "https://cdn.skypack.dev/lcov-parse";

interface LineDetail {
  line: number;
  hit: number;
}

interface FunctionDetail {
  name: string;
  line: number;
  hit: number;
}

interface BranchDetail {
  line: number;
  block: number;
  branch: number;
  taken: number;
}

interface LcovResult {
  file: string;
  lines: { found: number; hit: number; details: LineDetail[] };
  functions: { found: number; hit: number; details: FunctionDetail[] };
  branches: { found: number; hit: number; details: BranchDetail[] };
}

const lcov = await Deno.readTextFile("./cov_profile.lcov");

// TODO: Compute which files have uncovered code and its percentage.
// TODO: Compute overall coverage percentage.
parseFile(lcov, (errorMessage: string | null, results: LcovResult[]) => {
  if (errorMessage !== null) {
    return console.error(errorMessage);
  }
  for (const report of results) {
    const uncoveredFns = report.functions.details.filter((fn) => fn.hit === 0);
    if (uncoveredFns.length > 0) {
      console.log("\nFile:", report.file);
      for (const fn of uncoveredFns) {
        console.log(
          "Uncovered function!",
          `${fn.name} (${report.file}:${fn.line})`,
        );
      }
    }
  }
});
