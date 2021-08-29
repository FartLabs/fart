import { IndentationSetting } from "./types.ts";
import type { CodeTemplate, MethodDetails } from "./code-templates/types.ts";

interface LoC {
  content: string;
  indentationLevel?: number;
}

export class CodeDocument {
  lines: LoC[];
  indentationLevel: number;
  constructor(
    private template: CodeTemplate,
    private indentation: IndentationSetting,
  ) {
    this.lines = [];
    this.indentationLevel = 0;
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

  addImport(source: string, dependencies: string[]) {
    source = source.replace(/\`/g, ""); // Remove quotes.
    const code = this.template.import(source, dependencies);
    if (code !== null) this.append(code);
  }

  addStruct(identifier: string) {
    const code = this.template.openStruct(identifier);
    if (code !== null) this.append(code);
  }

  closeStruct() {
    const code = this.template.closeStruct();
    if (code !== null) this.append(code);
  }

  addProperty(identifier: string, required?: boolean, type?: string) {
    const code = this.template.property(identifier, required, type);
    if (code !== null) this.append(code);
  }

  addMethod(
    identifier: string,
    required?: boolean,
    inputType?: string,
    outputType?: string,
  ) {
    const code = this.template.method(identifier, {
      required,
      input: inputType,
      output: outputType,
    });
    if (code !== null) this.append(code);
  }

  nest() {
    this.incrementIndentationLevel();
  }

  compile(): string {
    // TODO: Assert that indentation level is 0 in order to compile.
    return this.lines.map(({ content, indentationLevel = 0 }) =>
      this.indentation.repeat(indentationLevel) + content
    ).join("\n");
  }
}
