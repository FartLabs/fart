import type { FartSettings } from "./types.ts";
import { IndentationSetting, LanguageTarget } from "./types.ts";
import { format as formatPath, parse as parsePath } from "../deps/std/path.ts";
import { TYPEMAPS } from "./typemaps.ts";

// TODO(ethanthatonekid): Allow for inclusive period characters in an "identifier".
export const validateIdentifier = (candidate: string): boolean =>
  /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(candidate);

export const validateStringLiteral = (candidate: string): boolean =>
  /^\`(.*?)\`$/g.test(candidate);

export const convertFilenameToTargetFilename = (
  filename: string,
  targetExt = ".ts",
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
  const typemap = { ...TYPEMAPS[target], ...settings?.typemap };
  return { target, indentation, typemap };
};
