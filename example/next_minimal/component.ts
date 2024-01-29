export interface Component<
  TType extends string = string,
  // deno-lint-ignore no-explicit-any
  TProps = any,
> {
  type: TType;
  properties: TProps;
  children?: (Component | string)[];
}

export interface GenerateFn<
  TComponent extends Component = Component,
  TOutput = string,
> {
  (component: TComponent): TOutput;
}
