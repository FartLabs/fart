import { getIndent, Indent, IndentOption } from "../../indent/mod.ts";

export interface LineOfCode {
  content: string;
  indentLevel: number;
}

/**
 * Represents a block of code.
 */
export class CodeBlock {
  public code: LineOfCode[] = [];

  append(content: string, indentLevel = 0): void {
    this.code.push(
      ...content.split("\n").map((line) => ({ content: line, indentLevel })),
    );
  }

  export(indent: IndentOption = Indent.Space2): string {
    return this.code
      .map(({ content, indentLevel }) =>
        getIndent(indent, indentLevel) + content
      )
      .join("\n");
  }

  /**
   * `toString` is an alias for `CodeBlock.export`.
   */
  toString = this.export.bind(this);

  static join(
    indentOrFirstBlock: IndentOption | CodeBlock,
    ...blocks: CodeBlock[]
  ): string {
    const blockPadding = 2; // lines between each code block
    const blockSeparator = "\n".repeat(blockPadding);
    const indentSpecified = !(indentOrFirstBlock instanceof CodeBlock);
    if (!indentSpecified) blocks = [indentOrFirstBlock, ...blocks];
    return blocks
      .filter((block) => block !== null)
      .reduce(
        (file, block, i) => {
          const exportedCode = indentSpecified
            ? block.export(indentOrFirstBlock)
            : block.export();
          return file + exportedCode +
            (blocks.length - 1 > i ? blockSeparator : "");
        },
        "",
      );
  }
}
