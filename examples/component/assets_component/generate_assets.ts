import { walk } from "../developer_deps.ts";
import type { Component, GenerateFn } from "../component.ts";
import { AssetKind, type Assets, calculateGitSha1 } from "./assets.ts";

export interface AssetsProps {
  root: string | URL;
  match?: RegExp[];
  skip?: RegExp[];
}

export type AssetsComponent = Component<"assets", AssetsProps>;

// https://github.com/denoland/deployctl/blob/3d0ba0f19e530bbfe94b241df1467dec3a8c6b4f/action/deps.js#L4017
export const generateAssets: GenerateFn<
  AssetsComponent,
  Promise<Assets>
> = async (
  component,
  // ctx,
) => {
  if (!component.properties) {
    throw new Error("Component properties are required.");
  }

  const assets: Assets = {};
  const it = walk(
    component.properties.root,
    {
      match: component.properties.match,
      skip: component.properties.skip,
      includeDirs: false,
    },
  );
  for await (const entry of it) {
    if (entry.isFile) {
      const data = await Deno.readFile(entry.path);
      assets[entry.path] = {
        kind: AssetKind.FILE,
        gitSha1: await calculateGitSha1(data),
        size: data.byteLength,
      };
    }

    if (entry.isSymlink) {
      assets[entry.path] = {
        kind: AssetKind.SYMLINK,
        target: Deno.readLinkSync(entry.path),
      };
    }
  }

  return assets;
};
