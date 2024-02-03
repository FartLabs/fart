export function jsx(
  tagNameOrComponent: any,
  props: any = {},
  ...children: any[]
) {
  if (typeof tagNameOrComponent === "function") {
    const component = tagNameOrComponent;
    return component({ ...props, children });
  }

  return { tagNameOrComponent, props, children };
}

export function jsxTemplate(
  strings: string[],
  ...dynamic: any[]
) {
  return { strings, dynamic };
}

export function jsxAttr(name: string, value: string) {
  return { name, value };
}

export function jsxEscape(value: string) {
  return value;
}
