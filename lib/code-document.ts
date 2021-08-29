import { FartIndentation } from "./types.ts";
import type { CodeTemplate } from "./code-templates/types.ts";

interface LoC {
  content: string;
  indentationLevel?: number;
}

export class CodeDocument {
  lines: LoC[];
  indentationLevel: number;
  importMode: boolean;
  structMode: boolean;
  constructor(
    private template: CodeTemplate,
    private indentation: FartIndentation,
  ) {
    this.lines = [];
    this.indentationLevel = 0;
    this.importMode = false;
    this.structMode = false;
  }

  append(line: string = "\n") {
    this.lines.push({ content: line, indentationLevel: this.indentationLevel });
  }

  incrementIndentationLevel() {
    this.indentationLevel++;
  }

  decrementIndentationLevel() {
    // TODO: Assert that indentation level is greater than 0.
    this.indentationLevel--;
  }

  openImport() {
    this.importMode = true;
  }

  nest() {
    this.incrementIndentationLevel();
  }

  denest() {
    this.decrementIndentationLevel();
    if (this.importMode) this.importMode = false;
    else if (this.structMode) this.structMode = false;
  }

  /*
  import: (src: string, detail?: ImportDetails) => string | null;
  openStruct: (id: string) => string | null;
  property: (id: string, type: string, required?: boolean) => string | null;
  method: (id: string, detail?: MethodDetails) => string | null;
  closeStruct: () => string | null;
  */

  compile(): string {
    // TODO: Assert that indentation level is 0 in order to compile.
    return this.lines.map(({ content, indentationLevel = 0 }) =>
      this.indentation.repeat(indentationLevel) + content
    ).join("\n");
  }
}
