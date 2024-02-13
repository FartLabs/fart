import { assertEquals } from "../developer_deps.ts";
import { generateAssets } from "./generate_assets.ts";

Deno.test("generateHTML", async () => {
  const assets = await generateAssets({
    type: "assets",
    properties: {
      root: "examples/component/assets_component",
    },
  });

  const { kind } =
    assets["examples\\component\\assets_component\\generate_assets_test.ts"];
  assertEquals(kind, "file");
});
