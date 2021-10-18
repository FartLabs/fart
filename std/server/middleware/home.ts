import {
  fetchGitHubFile,
  makeCacheLayer,
  removeFrontmatter,
} from "../common.ts";
import { Mime } from "../../common.ts";
import { Time } from "../../../lib/consts/time.ts";
import { marked as parse } from "../../../deps/third_party/marked.ts";

const fetchPageBody = async (): Promise<string> => {
  const readmePath = "EthanThatOneKid/fart/main/README.md";
  const readmeText = await fetchGitHubFile(readmePath);
  if (readmeText === undefined) return "";
  const html = parse(removeFrontmatter(readmeText));
  return html;
};

const cache = makeCacheLayer(async () =>
  `<html>
<head>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main id="wrapper">
    <a href="https://etok.codes/fart/blob/main/README.md#readme" style="float: right;">
      <img src="fart-logo.png" alt="Fart Logo" style="width: 144px;" />
    </a>
    ${await fetchPageBody()}
  </main>
</body>
</html>`, Time.Hour);

export default async (): Promise<Response> =>
  new Response(
    await cache(),
    {
      status: 200,
      headers: { "Content-Type": Mime.HTML },
    },
  );
