import {
  INDENT,
  Indent,
  IndentCacheIndex,
  IndentOption,
} from "../consts/indent.ts";

const NEW_LINE = "\n";
const DEFAULT_INDENT_OPTION = Indent.Space2;

/**
 * This type covers each way a **block of code** may be represented.
 * A string implies the block is one line. An array of strings
 * implies a multi-line code block. A 2D array of strings implies
 * a multi-line code block with indentations.
 */
export type SerializedBoC = string | string[] | string[][];

/**
 * LoC stands for _Line of Code_.
 */
export class LoC {
  constructor(
    public content: string,
    public indentOption: IndentOption | string = DEFAULT_INDENT_OPTION,
    public indentLevel = 0,
  ) {}

  export(indentOption?: IndentOption | string, offset = 0): string {
    const indent = getIndent(
      indentOption ?? this.indentOption,
      offset + this.indentLevel,
    );
    return indent + this.content;
  }

  setIndentLevel(level: number) {
    if (level > 0) {
      this.indentLevel = Math.floor(level);
    }
  }

  toString = this.export.bind(this);
}

/**
 * BoC stands for _Block of Code_.
 */
export class BoC {
  public active = true;

  constructor(
    public lines: LoC[] = [],
    public indent: IndentOption | string = DEFAULT_INDENT_OPTION,
    public padding = 0, // Blank lines placed below the code block.
    public indentOffset = 0,
  ) {}

  append(content: LoC): void;
  append(
    content: string,
    indent?: IndentOption | string,
    indentLevel?: number,
  ): void;
  append(
    content: LoC | string,
    indent?: IndentOption | string,
    indentLevel = 0,
  ) {
    const line = content instanceof LoC
      ? content
      : new LoC(content, indent, indentLevel);
    this.lines.push(line);
  }

  // TODO: Implement padding_top/bottom.
  setPadding(padding: number) {
    this.padding = padding;
  }

  setIndentOffset(offset: number) {
    this.indentOffset = offset;
  }

  /**
   * Omits _this_ from result.
   */
  skip() {
    this.active = false;
  }

  export(): string {
    return this.lines
      .map((line) => line.export(this.indent, this.indentOffset))
      .join(NEW_LINE);
  }

  toString = this.export.bind(this);

  static parse(
    content: string,
    indent: IndentOption | string,
  ): BoC | undefined;
  static parse(
    content: string[],
    indent: IndentOption | string,
  ): BoC | undefined;
  static parse(
    content: string[][],
    indent: IndentOption | string,
  ): BoC | undefined;
  static parse(
    content: SerializedBoC,
    indent: IndentOption | string,
  ): BoC | undefined;
  static parse(
    content?: SerializedBoC,
    indent: IndentOption | string = DEFAULT_INDENT_OPTION,
  ): BoC | undefined {
    if (content === undefined) return;
    const block = new BoC([], indent);
    const gimmeLine = (line: string, offset = 0) =>
      block.append(new LoC(line, indent, offset));
    if (typeof content === "string") {
      gimmeLine(content);
      return block;
    }
    for (const line of content) {
      if (typeof line === "string") {
        gimmeLine(line);
        continue;
      }
      const indentLevelOffset = line.findIndex(({ length }) => length > 0);
      gimmeLine(line[indentLevelOffset], indentLevelOffset);
    }
  }

  static join(...blocks: (BoC | null)[]) {
    return blocks
      .filter((block) => block?.active)
      .reduce((result, block) => {
        if (block === null) return result;
        return result + block.export() + NEW_LINE.repeat(block.padding + 1);
      }, "");
  }
}

export function getIndentOption(
  indentOption: IndentOption | string,
): IndentOption | null {
  let option: IndentOption | null = null;
  switch (indentOption) {
    case Indent.Tab1: {
      option = Indent.Tab1;
      break;
    }
    case Indent.Space1: {
      option = Indent.Space1;
      break;
    }
    case Indent.Space2: {
      option = Indent.Space2;
      break;
    }
    case Indent.Space3: {
      option = Indent.Space3;
      break;
    }
    case Indent.Space4: {
      option = Indent.Space4;
      break;
    }
  }
  return option;
}

export function getCachedIndent(
  indentOption: IndentOption,
  indentLevel: number,
): string | null {
  if (0 > indentLevel || indentLevel > 16) return null;
  switch (indentOption) {
    case Indent.Tab1: {
      const indentCacheIndex = -1 *
        Math.floor(indentLevel) as IndentCacheIndex;
      return INDENT[indentCacheIndex];
    }
    case Indent.Space1:
    case Indent.Space2:
    case Indent.Space3:
    case Indent.Space4: {
      const indentCacheIndex = indentOption *
        Math.floor(indentLevel) as IndentCacheIndex;
      return INDENT[indentCacheIndex];
    }
    default:
      return null;
  }
}

/**
 * This function will either return a cached indent string
 * from `/lib/constants/indent.ts`.
 *
 * ## Usage
 *
 * ```ts
 * // Tab spacing is represented by -1.
 * getIndent(-1, 1) // "\t"
 * getIndent(-1, 3) // "\t\t\t"
 *
 * // Single, double, triple, and quadruple spaces are
 * // represented by 1, 2, 3, and 4 respectively.
 * getIndent(1, 1) // " "
 * getIndent(1, 3) // "  "
 * getIndent(2, 3) // "      "
 * getIndent(3, 3) // "         "
 * getIndent(4, 3) // "                "
 *
 * // For non-cached indents, a string may be passed
 * // instead and will be computed immediately.
 * getIndent("#", 3) // "###"
 * getIndent("_", 20) // "____________________"
 *
 * // Any invalid indentation options will result in the
 * // return of an empty string.
 * getIndent(5, 1) // ""
 * getIndent(-2, 1) // ""
 * ```
 */
export function getIndent(
  indentOption: IndentOption | string,
  indentLevel: number,
): string {
  const option = getIndentOption(indentOption);
  indentLevel = Math.floor(Math.max(0, indentLevel)); // Assert indent level is a positive integer.
  if (option !== null) {
    const cachedIndent = getCachedIndent(option, indentLevel);
    if (cachedIndent !== null) return cachedIndent;
  }
  if (typeof indentOption === "string") {
    return indentOption.repeat(Math.max(indentLevel, 0));
  }
  return "";
}
