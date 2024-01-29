export interface Component<
  TType extends string = string,
  TProps extends object = Record<string, unknown>,
> {
  type: TType;
  properties: TProps;
  children?: (Component | string)[];
}
