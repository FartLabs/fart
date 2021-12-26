import { INDENT, Indent, IndentCacheIndex, IndentOption } from "./indent.ts";

export function getIndentOption(
  indentOption: IndentOption | string,
): IndentOption | null {
  let option: IndentOption | null = null;
  switch (indentOption) {
    case Indent.Tab1: {
      option = Indent.Tab1;
      break;
    }
    case Indent.Tab2: {
      option = Indent.Tab2;
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
): string {
  const indentCacheIndex = indentOption *
    Math.floor(indentLevel) as IndentCacheIndex;
  return INDENT[indentCacheIndex];
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
