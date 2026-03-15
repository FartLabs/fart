import { assertEquals, assertThrows, assert } from "@std/assert";
import { INDENT, Indent } from "./indent.ts";
import { getCachedIndent } from "./utils.ts";

const CACHE_BENCH_ID = "CACHE_TEST";
const COMPUTED_BENCH_ID = "COMPUTED_TEST";

Deno.bench({
  name: CACHE_BENCH_ID,
  fn: () => {
    const store: string[] = [];
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Tab1, i));
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Tab2, i));
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Space1, i));
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Space2, i));
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Space3, i));
    for (let i = 1; i <= 16; i++) store.push(getCachedIndent(Indent.Space4, i));
  },
});

Deno.bench({
  name: COMPUTED_BENCH_ID,
  fn: () => {
    const store: string[] = [];
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Tab1].repeat(i));
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Tab2].repeat(i));
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Space1].repeat(i));
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Space2].repeat(i));
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Space3].repeat(i));
    for (let i = 1; i <= 16; i++) store.push(INDENT[Indent.Space4].repeat(i));
  },
});
