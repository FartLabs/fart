// TODO: Fix type error.
// JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.deno-ts(7026)
function App() {
  return (
    <div hello="world">
      <h1>Hello, world!</h1>
    </div>
  );
}

/**
```json
{
  tagNameOrComponent: "div",
  props: {
    hello: "world",
    children: {
      tagNameOrComponent: "h1",
      props: { children: "Hello, world!" },
      children: []
    }
  },
  children: []
}
```
*/
console.log(<App />);

// deno run -A example/simple/simple.tsx

// https://github.com/honojs/hono/blob/v3.12.10/deno_dist/jsx/index.ts
// https://hono.dev/guides/jsx#pre-compile
// https://deno.com/blog/v1.38#fastest-jsx-transform
