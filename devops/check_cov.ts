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

import { source as parseFile } from "lcov-parse";

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

  let totalLinesFound = 0;
  let totalLinesHit = 0;

  for (const report of results) {
    totalLinesFound += report.lines.found;
    totalLinesHit += report.lines.hit;

    const fileCoverage = report.lines.found === 0 
      ? 100 
      : Math.round((report.lines.hit / report.lines.found) * 100);

    const uncoveredFns = report.functions.details.filter((fn) => fn.hit === 0);
    
    if (uncoveredFns.length > 0 || fileCoverage < 100) {
      console.log(`\nFile: ${report.file} (${fileCoverage}% covered)`);
      for (const fn of uncoveredFns) {
        console.log(
          "Uncovered function!",
          `${fn.name} (${report.file}:${fn.line})`,
        );
      }
    }
  }

  const overallCoverage = totalLinesFound === 0 
    ? 100 
    : Math.round((totalLinesHit / totalLinesFound) * 100);
  
  console.log(`\nOverall Coverage: ${overallCoverage}% (${totalLinesHit}/${totalLinesFound} lines)`);
});
