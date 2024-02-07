const METHODS = [
  "*",
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
] as const;

type Method = (typeof METHODS)[number];

type Router<T> = Record<string, Record<Method, T>>;

interface HTTPServerProps {
  port: number;
  router: Router<string>;
}

export function generateHTTPServer(props: HTTPServerProps): string {
  // return <CodeBlock>
  // What is the difference between importing
  // the code rendered by this component and
  // generating the code for later use?
  return (
    <>
      {"const routes = Object.entries("}
      {JSON.stringify(props.router, null, 2)}
      {").map(([path, methods]) => {"}
      {"return { path, methods };"}
      {"});"}
      {}
      {"const server = Deno.serve({ port: "}
      {";"}
      {"Deno.serve({ port: "}
      {props.port}
      {" }, async (request) => {"}
      {"const { url, method } = request;"}
      {}
    </>
  );
  // </CodeBlock>;
}

console.log(
  <generateHTTPServer
    port={8080}
    handler="users"
    router={{
      users: {
        GET: "getUsers",
        POST: "createUser",
      },
    }}
  />
);
