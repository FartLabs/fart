import type { FartSettings } from "./types.ts";
import { IndentationSetting, LanguageTarget, Lexicon } from "./types.ts";
import { format as formatPath, parse as parsePath } from "../deps/std/path.ts";
import { typemaps } from "./typemaps.ts";

// TODO(ethanthatonekid): Allow for inclusive period characters in an "identifier".
export const validateIdentifier = (candidate: string): boolean =>
  /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(candidate);

export const validateStringLiteral = (candidate: string): boolean =>
  /^\`(.*?)\`$/g.test(candidate);

const reservedWords = new Set<Lexicon>([
  Lexicon.ImpoDefiner,
  Lexicon.TypeDefiner,
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
  }).replace("\\", "/");
};

/**
 * Infers omitted settings.
 */
export const validateSettings = (
  settings?: FartSettings,
): Required<FartSettings> => {
  const target = settings?.target ?? LanguageTarget.TypeScript;
  const indentation = settings?.indentation ?? IndentationSetting.DoubleSpace;
  const typemap = { ...typemaps[target], ...settings?.typemap };
  return { target, indentation, typemap };
};
