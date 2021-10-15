import { fetchGitHubFile, makeCacheLayer } from "../common.ts";
import { Mime } from "../../common.ts";
import { Time } from "../../../lib/consts/time.ts";
import { marked as parse } from "../../../deps/third_party/marked.ts";

const fetchPageBody = async (): Promise<string> => {
  const readmePath = "EthanThatOneKid/fart/main/README.md";
  const readmeText = await fetchGitHubFile(readmePath);
  if (readmeText === undefined) return "";
  const html = parse(readmeText);
  return html;
};

const cache = makeCacheLayer(async () =>
  `<html>
<head>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main id="wrapper">
    <img src="fart-logo.png" alt="Fart Logo" style="float: right; width: 144px;" />
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
