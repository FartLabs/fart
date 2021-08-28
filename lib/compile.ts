import { tokenize } from "./tokenize.ts";
import { FartGrammar } from "./types.ts";
import { createInitialState, initializeSettings } from "./utils.ts";
import type { FartSettings, FartState } from "./types.ts";

export function compile(content: string, settings?: FartSettings): string {
  settings = initializeSettings(settings);
  const state = createInitialState();
  // TODO(ethanthatonekid): Generate code from tokens.
  for (const token of tokenize(content)) {}
  return state.result.map(({ content }) => content).join("\n");
}
