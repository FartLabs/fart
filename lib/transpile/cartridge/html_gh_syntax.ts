import { tokenize } from "../tokenize/tokenize.ts";
import { Lexeme } from "../tokenize/lexeme.ts";
import type { Token } from "../tokenize/token.ts";

/**
 * Maps a Fart token kind to a GitHub-compatible syntax highlighting CSS class.
 * Based on regular expressions and common definitions from:
 * https://github.com/primer/github-syntax-theme-generator
 */
function getCssClassForToken(token: Token): string | null {
  switch (token.kind) {
    case Lexeme.TypeDefiner:
    case Lexeme.TupleOpener:
    case Lexeme.TupleCloser:
    case Lexeme.Modifier:
    case Lexeme.StructOpener:
    case Lexeme.StructCloser:
    case Lexeme.PropertyOptionalMarker:
    case Lexeme.PropertyDefiner:
    case Lexeme.Separator:
      // Keywords or punctuation logic operators
      return "pl-k";

    case Lexeme.Identifier:
      // Check if it looks like a built-in primitive type
      if (
        ["string", "number", "boolean", "null", "undefined"].includes(
          token.value,
        )
      ) {
        return "pl-c1"; // Constants/builtins
      }
      return "pl-en"; // Entity/identifier

    case Lexeme.TextLiteral:
      return "pl-s"; // String

    case Lexeme.InlineComment:
    case Lexeme.MultilineComment:
      return "pl-c"; // Comment

    default:
      return null;
  }
}

/**
 * Escapes HTML characters in the token raw values.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Tokenizes the input Fart source and returns an HTML string
 * containing the code styled with GitHub's `blob-code` CSS structure.
 */
export function generateHtmlGhSyntax(source: string): string {
  let html = "<tbody>\n";
  let currentLineNumber = 1;
  let currentColumn = 1;
  let lineContent = "";

  const emitLine = () => {
    html += `  <tr>\n`;
    html +=
      `    <td id="L${currentLineNumber}" class="blob-num js-line-number" data-line-number="${currentLineNumber}"></td>\n`;
    // If lineContent is totally empty, we inject a zero-width space or leave it empty
    // GitHub often leaves the tag empty or uses `<br>` but standard `js-file-line` is fine.
    html +=
      `    <td id="LC${currentLineNumber}" class="blob-code blob-code-inner js-file-line">${lineContent}</td>\n`;
    html += `  </tr>\n`;
    currentLineNumber++;
    currentColumn = 1;
    lineContent = "";
  };

  const tokens = tokenize(source);

  for (const token of tokens) {
    // If the token jumps to a new line, emit the current line buffer
    while (token.line > currentLineNumber) {
      emitLine();
    }

    // If the token jumps columns within the *same* line, inject padding whitespace.
    // Notice that a multi-line comment will break this naive column spacing if we don't handle its own internal newlines.
    if (token.column > currentColumn) {
      lineContent += escapeHtml(" ".repeat(token.column - currentColumn));
      currentColumn = token.column;
    }

    const cssClass = getCssClassForToken(token);
    const escapedRaw = escapeHtml(token.raw);

    if (cssClass) {
      lineContent += `<span class="${cssClass}">${escapedRaw}</span>`;
    } else {
      lineContent += escapedRaw;
    }

    // Some tokens (like MultilineComments) contain internal newlines.
    // We must update the manual column/line tracker if they do.
    const internalNewlineCount = token.raw.split("\n").length - 1;
    if (internalNewlineCount > 0) {
      // NOTE: token.column is at the *start* of the token natively.
      // So we don't technically need to track the end column manually
      // since the next token will jump to its own start column anyway.
      // But we must NOT inject spaces where there are newlines within a token.
      currentLineNumber += internalNewlineCount;
      const splitLines = token.raw.split("\n");
      currentColumn = splitLines[splitLines.length - 1].length + 1;
    } else {
      currentColumn += token.raw.length;
    }
  }

  // Flush remaining
  emitLine();

  html += "</tbody>";
  return html;
}
