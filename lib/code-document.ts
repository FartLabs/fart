import {
  DoubleSpaceIndentation,
  IndentationSetting,
  QuadrupleSpaceIndentation,
  SingleSpaceIndentation,
  TabIndentation,
  TripleSpaceIndentation,
} from "./types.ts";
import { CodeCart } from "./code-cart/mod.ts";
import { TypeMap } from "./typemaps.ts";
import { CodeCartEvent } from "./code-cart/mod.ts";

interface LoC {
  content: string;
  indentationLevel?: number;
}

export class CodeDocument {
  lines: LoC[];
  indentationLevel: number;
  constructor(
    private codeCartridge: CodeCart,
    private typemap: TypeMap,
    private indentation: string,
  ) {
    this.lines = [];
    this.indentationLevel = 0;
  }

  append(line?: string) {
    if (line !== undefined) {
      this.lines.push({
        content: line,
        indentationLevel: this.indentationLevel,
      });
    }
  }

  incrementIndentationLevel() {
    this.indentationLevel++;
  }

  decrementIndentationLevel() {
    // TODO: Assert that indentation level is greater than 0.
    this.indentationLevel--;
  }

  addImport(source: string, dependencies: string[]) {
    const code = this.codeCartridge.dispatch(
      CodeCartEvent.Import,
      source,
      dependencies,
    );
    if (code !== null) {
      for (const depId of dependencies) this.typemap[depId] = depId;
      this.append(code);
    }
  }

  addStruct(identifier: string) {
    const code = this.codeCartridge.dispatch(
      CodeCartEvent.StructOpen,
      identifier,
    );
    if (code !== null) {
      this.typemap[identifier] = identifier;
      this.append(code);
    }
  }

  closeStruct() {
    const code = this.codeCartridge.dispatch(CodeCartEvent.StructClose);
    if (code !== null) this.append(code);
  }

  addProperty(identifier: string, required?: boolean, type?: string) {
    const code = this.codeCartridge.dispatch(
      CodeCartEvent.SetProperty,
      identifier,
      required,
      this.getType(type),
    );
    if (code !== null) this.append(code);
  }

  addMethod(
    identifier: string,
    required?: boolean,
    inputType?: string,
    outputType?: string,
  ) {
    const code = this.codeCartridge.dispatch(
      CodeCartEvent.SetMethod,
      identifier,
      {
        required,
        input: this.getType(inputType),
        output: this.getType(outputType),
      },
    );
    if (code !== null) this.append(code);
  }

  public compile(): string {
    // TODO: Assert that indentation level is 0 in order to compile.
    return this.lines.map(({ content, indentationLevel = 0 }) =>
      CodeDocument.getIndentation(this.indentation, indentationLevel) + content
    ).join("\n");
  }

  private getType(typeAlias?: string): string | undefined {
    if (typeAlias === undefined) return undefined;
    if (this.typemap[typeAlias] !== undefined) {
      return this.typemap[typeAlias];
    }
    // TODO: Throw error.
    console.log(`no such type ${typeAlias}`);
    return this.typemap._;
  }

  static getIndentation(indentation: string, indentationLevel: number): string {
    if (
      indentation in IndentationSetting &&
      indentationLevel > -1 &&
      indentationLevel < 16
    ) {
      switch (indentation) {
        case IndentationSetting.Tab:
          return TabIndentation[indentationLevel];
        case IndentationSetting.SingleSpace:
          return SingleSpaceIndentation[indentationLevel];
        case IndentationSetting.DoubleSpace:
          return DoubleSpaceIndentation[indentationLevel];
        case IndentationSetting.TripleSpace:
          return TripleSpaceIndentation[indentationLevel];
        case IndentationSetting.QuadrupleSpace:
          return QuadrupleSpaceIndentation[indentationLevel];
      }
    }
    return indentation.repeat(Math.max(indentationLevel, 0));
  }
}
