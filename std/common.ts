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

export enum Mime {
  TypeScript = "application/typescript; charset=UTF-8",
  JSON = "application/json; charset=UTF-8",
  HTML = "text/html; charset=UTF-8",
  CSS = "text/css; charset=UTF-8",
  Plain = "text/plain; charset=UTF-8",
  PNG = "image/png",
}

export const getMimeType = (pathname: string): Mime =>
  pathname.endsWith(".css")
    ? Mime.CSS
    : pathname.endsWith(".html")
    ? Mime.HTML
    : pathname.endsWith(".json")
    ? Mime.JSON
    : pathname.endsWith(".ts")
    ? Mime.TypeScript
    : pathname.endsWith(".png")
    ? Mime.PNG
    : Mime.Plain;
