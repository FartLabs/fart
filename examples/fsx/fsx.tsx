// fsx
function SvelteKitApp(props: any) {
  return <div>{props.children}</div>;
}

function File(props: any) {
  return <div>{props.children}</div>;
}

// The purpose of Fart is to generate code in an infinitely scalable way.
// Allow people to generate file structures with a simple API.
// I am thinking...:
<SvelteKitApp props={props}>
  {/* Overwrite files warn by default. */}
  <File
    target="src/routes/index.svelte"
    src="examples/registry/usage.tsx"
    overwrite
  />
  <File
    target="src/routes/index.svelte"
    src="examples/registry/system.ts"
    overwrite
  />
</SvelteKitApp>;
