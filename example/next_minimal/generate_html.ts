import type { Component } from "./component.ts";

export function generateHTMLAttributes(
  attributes: Record<string, unknown>,
): string {
  const keys = Object.keys(attributes);
  if (keys.length === 0) {
    return "";
  }

  return " " + keys
    .map((key) => `${key}="${attributes[key]}"`)
    .join(" ");
}

export function generateHTMLChildren(
  children?: (Component | string)[],
): string {
  return children
    ?.map((child) => typeof child === "string" ? child : generateHTML(child))
    .join("\n") ?? "";
}

export function generateHTML(component: Component): string {
  return `<${component.type}${generateHTMLAttributes(component.properties)}>\n${
    generateHTMLChildren(component.children)
  }\n</${component.type}>`;
}
