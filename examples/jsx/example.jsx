function Example() {
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
console.log(<Example />);

// deno run -A examples/jsx/example.jsx
