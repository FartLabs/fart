import type { Component, GenerateFn } from "../component.ts";

export function generateHTMLAttributes(
  attributes?: Record<string, unknown>,
): string {
  if (!attributes) {
    return "";
  }

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
    .join("") ?? "";
}

export const generateHTML: GenerateFn = (component) => {
  return `<${component.type}${generateHTMLAttributes(component.properties)}>${
    generateHTMLChildren(component.children)
  }</${component.type}>`;
};
