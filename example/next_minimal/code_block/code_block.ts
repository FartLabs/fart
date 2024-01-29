import type { Component } from "../component.ts";

export interface CodeBlockProperties {
  /**
   * Newline character.
   * @remarks Defaults to \n.
   */
  newLine?: "\n" | "\r\n";

  /**
   * Number of spaces to indent when `useTabs` is false.
   * @remarks Defaults to 4.
   */
  indentNumberOfSpaces?: number;

  /**
   * Whether to use tabs (true) or spaces (false).
   * @remarks Defaults to false.
   */
  useTabs?: boolean;

  /**
   * Starting indentation level.
   */
  indentLevel?: number;
}

export type CodeBlockComponent = Component<
  string,
  CodeBlockProperties
>;

export function indentCodeBlock(
  block: string,
  options: CodeBlockProperties,
): string {
  const newLine = options.newLine ?? "\n";
  const indentNumberOfSpaces = options.indentNumberOfSpaces ?? 4;
  const useTabs = options.useTabs ?? false;
  const indentLevel = options.indentLevel ?? 0;
  const indent = useTabs
    ? "\t".repeat(indentLevel)
    : " ".repeat(indentLevel * indentNumberOfSpaces);
  return block
    .split("\n")
    .map((line) => indent + line)
    .join(newLine);
}

export function generateCodeBlock(component: CodeBlockComponent): string {
  const indentLevel = component.properties.indentLevel ?? 0;
  return component.children
    ?.map((child: CodeBlockComponent | string) => {
      if (typeof child === "string") {
        return indentCodeBlock(child, component.properties);
      }

      // TODO: Generate TS code. How to generate plain text with external logic?
      return generateCodeBlock({
        ...child,
        properties: {
          ...component.properties,
          ...child.properties,
          indentLevel: indentLevel + (child.properties.indentLevel ?? 0),
        },
      });
    })
    .join("\n") ?? "";
}
