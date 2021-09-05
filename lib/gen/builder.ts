import { Indent, IndentOption, INDENT } from "../constants/indent.ts";
import { CodeCart } from "./code-cart/mod.ts";
  import { TypeMap } from "./typemaps.ts";
  import { CodeCartEvent } from "./code-cart/mod.ts";
  
  export interface LoC {
    content: string;
    indentLevel?: number;
  }
  
  export class Builder {
    lines: LoC[];
    currentIndentLevel: number;
    constructor(
      private codeCartridge: CodeCart,
      private typemap: TypeMap,
      private indent: IndentOption | string,
    ) {
      this.lines = [];
      this.currentIndentLevel = 0;
    }
  
    private append(line?: string) {
      if (line !== undefined) {
        this.lines.push({
          content: line,
          indentLevel: this.currentIndentLevel,
        });
      }
    }
  
    public incrementIndentLevel() {
      this.currentIndentLevel++;
    }
  
    public decrementIndentLevel() {
      // TODO: Assert that indentation level is greater than 0.
      if (this.currentIndentLevel > 0) {
        this.currentIndentLevel--;
      }
    }
  
    /*
    [CodeCartEvent.Import]: (
        src: string,
        dependencies: string[],
      ) => string | null;
      [CodeCartEvent.StructOpen]: (id: string, depo?: boolean) => string | null;
      [CodeCartEvent.SetProperty]: (
        id: string,
        required?: boolean,
        type?: string,
      ) => string | null;
      [CodeCartEvent.SetMethod]: (
        id: string,
        detail?: MethodDetails,
      ) => string | null;
      [CodeCartEvent.StructClose]: (depo?: boolean) => string | null;
      */
    public appendImport(
        source: Parameters<CodeCartHandlerMap[CodeCartEvent.Import]>[0],
        dependencies: Parameters<CodeCartHandlerMap[CodeCartEvent.Import]>[1]
    ) {
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
  
    public appendOpeningStruct(
        identifier: Parameters<CodeCartHandlerMap[CodeCartEvent.StructOpen]>[0],
        depo: Parameters<CodeCartHandlerMap[CodeCartEvent.StructOpen]>[1]
    ) {
      const code = this.codeCartridge.dispatch(CodeCartEvent.StructOpen, identifier, depo);
      if (code !== null) {
        this.typemap[identifier] = identifier;
        this.append(code);
      }
    }
  
    public appendProperty(
        identifier: Parameters<CodeCartHandlerMap[CodeCartEvent.SetProperty]>[0],
        required: Parameters<CodeCartHandlerMap[CodeCartEvent.SetProperty]>[1],
        type: Parameters<CodeCartHandlerMap[CodeCartEvent.SetProperty]>[2]
    ) {
      const code = this.codeCartridge.dispatch(
        CodeCartEvent.SetProperty,
        identifier,
        required,
        this.getType(type),
      );
      if (code !== null) this.append(code);
    }
  
    public appendMethod(
      identifier: Parameters<CodeCartHandlerMap[CodeCartEvent.SetMethod]>[0],
      required: Parameters<CodeCartHandlerMap[CodeCartEvent.SetMethod]>[1],
      inputType: Parameters<CodeCartHandlerMap[CodeCartEvent.SetMethod]>[2],
      outputType: Parameters<CodeCartHandlerMap[CodeCartEvent.SetMethod]>[3],
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

    public appendClosingStruct() {
      const code = this.codeCartridge.dispatch(CodeCartEvent.StructClose);
      if (code !== null) this.append(code);
    }
  
    public export(): string {
      // TODO: Assert that indentation level is 0 in order to compile.
      return this.lines.map(({ content, indentLevel = 0 }) =>
        CodeDocument.getIndentation(this.indent, indentLevel) + content
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
  
    static getIndent(indentOption: IndentOption | string, indentLevel: number): string {
        let option: IndentOption;
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
        if (
            0 >= indentationLevel &&
            option !== undefined &&
            indentationLevel <= 16
        ) {
            const indentId = option !== Indent.Tab1
              ? option * indentationLevel
              : -1 * indentationLevel;
            return INDENT[indentId];
        }
        return indentation.repeat(Math.max(indentationLevel, 0));
    }
  }
  