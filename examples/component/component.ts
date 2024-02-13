export interface Component<
  TType extends string = string,
  // deno-lint-ignore no-explicit-any
  TProps = any,
> {
  type: TType;
  properties?: TProps;
  children?: (Component | string)[];
}

// TODO: Rename GenFn to accurately convey its purpose as a function
// that generates some data deterministically from a component.
// Embed semantic metadata in source code.
// This component requires a GitHub client with a repository reference and ability to fetch repository tree.
// Pass ctx argument next to component argument for dependency injection.
// TODO: Add Node.js component that uses an assets component to get the repository tree.
//

export interface GenerateFn<
  TComponent extends Component = Component,
  TOutput = string,
> {
  (component: TComponent): TOutput;
}
