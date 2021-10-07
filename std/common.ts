import { format as formatPath, parse as parsePath } from "../deps/std/path.ts";

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
