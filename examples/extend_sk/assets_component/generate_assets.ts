import { walk } from "../developer_deps.ts";
import type { Component, GenerateFn } from "../../component/component.ts";
import { AssetKind, type Assets, calculateGitSha1 } from "./assets.ts";
import { globToRegExp } from "../developer_deps.ts";

export interface AssetsProps {
  root: string | URL;
  match?: RegExp[];
  skip?: RegExp[];
}

// https://github.com/denoland/deployctl/blob/3d0ba0f19e530bbfe94b241df1467dec3a8c6b4f/action/deps.js#L4017
export const generateAssets: GenerateFn<
  Component<"assets", AssetsProps>,
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

// deno run --allow-read examples/extend_sk/assets_component/generate_assets.ts
if (import.meta.main) {
  const assets = await generateAssets({
    type: "assets",
    properties: {
      root: ".",
      skip: [globToRegExp(".git")],
    },
  });
  console.log({ assets });
}

// https://api.github.com/repos/ethanthatonekid/sk_skeleton/git/trees/7963c4db951f29ff2c458783d7290eb09e680b3e?recursive=1
