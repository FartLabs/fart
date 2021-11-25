import {
  assert,
  bench,
  BenchmarkResult,
  BenchmarkTimer,
  runBenchmarks,
} from "../../deps/std/testing.ts";
import { INDENT, Indent } from "./indent.ts";
import { getCachedIndent } from "./utils.ts";

const CACHE_BENCH_ID = "CACHE_TEST";
const COMPUTED_BENCH_ID = "COMPUTED_TEST";
const BENCH_RUNS = 100; // the higher the number, the more accurate the benchmark results

/**
 * @see https://deno.land/std@0.63.0/testing#benching
 */
bench({
  name: CACHE_BENCH_ID,
  runs: BENCH_RUNS, // averaging execution time over multiple runs
  func: (timer: BenchmarkTimer): void => {
    const store: string[] = [];
    timer.start();
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Tab1, i));
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Tab2, i));
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Space1, i));
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Space2, i));
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Space3, i));
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Space4, i));
    timer.stop();
  },
});

bench({
  name: COMPUTED_BENCH_ID,
  runs: BENCH_RUNS, // averaging execution time over multiple runs
  func: (timer: BenchmarkTimer): void => {
    const store: string[] = [];
    timer.start();
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Tab1].repeat(i));
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Tab2].repeat(i));
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Space1].repeat(i));
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Space2].repeat(i));
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Space3].repeat(i));
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Space4].repeat(i));
    timer.stop();
  },
});

Deno.test("benchmarking the cache algorithm vs the `repeat` method", async () => {
  const { results } = await runBenchmarks({ silent: true });
  const cacheResults = results.find(({ name }) =>
    name === CACHE_BENCH_ID
  ) as BenchmarkResult;
  const computedResults = results.find(({ name }) =>
    name === COMPUTED_BENCH_ID
  ) as BenchmarkResult;
  const speedBoost = computedResults.measuredRunsAvgMs /
    cacheResults.measuredRunsAvgMs;
  const speedBoostPercentage = (speedBoost - 1) * 100;
  const finalMessage = `the cache algorithm is ${
    speedBoostPercentage.toFixed(2)
  }% the speed of the \`repeat\` algorithm`;
  console.log(finalMessage);
  assert(speedBoost > 1);
});
