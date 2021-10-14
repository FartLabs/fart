import { fetchGitHubFile } from "../common.ts";
import { Mime } from "../../common.ts";
import { marked as parse } from "../../../deps/third_party/marked.ts";

const fetchPageBody = async (): Promise<string> => {
  const readmePath = "EthanThatOneKid/fart/main/README.md";
  const readmeText = await fetchGitHubFile(readmePath);
  if (readmeText === undefined) return "";
  const html = parse(readmeText);
  return html;
};

export default async (): Promise<Response> =>
  new Response(
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
</html>`,
    {
      status: 200,
      headers: { "Content-Type": Mime.HTML },
    },
  );
