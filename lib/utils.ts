import type { FartSettings, FartState } from "./types.ts";
import { FartGrammar, FartIndentation, FartTarget } from "./types.ts";
import { format as formatPath, parse as parsePath } from "../deps/std/path.ts";
import { typemaps } from "./typemaps.ts";

// TODO(ethanthatonekid): Allow for inclusive period characters in an "identifier".
export const validateIdentifier = (candidate: string): boolean =>
  /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(candidate);

const reservedWords = new Set<FartGrammar>([
  FartGrammar.DepoDefiner,
  FartGrammar.TypeDefiner,
]);

export const checkNextToken = (
  token: string,
  set: Set<string> = reservedWords,
) => set.has(token);

export const convertFilenameToTargetFilename = (
  filename: string,
  targetExt: string = ".ts",
) => {
  const info = parsePath(filename);
  return formatPath({
    root: info.root,
    dir: info.dir,
    ext: targetExt,
    name: info.name,
  });
};

export const createInitialState = (): FartState => ({
  result: [],
  warnings: [],
  errors: [],
});

/**
 * Infers omitted settings.
 */
export const initializeSettings = (
  settings?: FartSettings,
): FartSettings => {
  const target = settings?.target ?? FartTarget.TypeScript;
  const indentation = settings?.indentation ?? FartIndentation.DoubleSpace;
  const typemap = { ...typemaps[target], ...settings?.typemap };
  return { target, indentation, typemap };
};
