import { IndentOption } from "../consts/indent.ts";
import { OMIT_PATTERN, ReservedType, TypeMap } from "./typemap.ts";
import { Cart, CartEventName } from "./cart.ts";
import { BoC } from "./common.ts";

/**
 * Also known as _File Builder_.
 */
export class Builder {
  blocks: BoC[] = [];
  currentIndentLevel = 0;
  localTypes: Set<string> = new Set([]);

  constructor(
    private cartridge: Cart,
    private typemap: TypeMap,
    private indent: IndentOption | string,
  ) {}

  private append(code?: BoC) {
    if (code === undefined) return;
    code.setIndentOffset(this.currentIndentLevel);
    // console.log("APPENDED", { code });
    this.blocks.push(code);
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

  public async appendImport(source: string, dependencies: string[]) {
    const code = await this.cartridge.dispatch({
      type: CartEventName.Import,
      source,
      dependencies,
    });
    if (code === null) return;
    for (const depId of dependencies) {
      this.localTypes.add(depId);
    }
    this.append(code);
  }

  public async appendOpeningStruct(identifier: string, department = false) {
    const code = await this.cartridge.dispatch({
      type: CartEventName.StructOpen,
      identifier,
      department,
    });
    if (code === null) return;
    this.localTypes.add(identifier);
    this.append(code);
  }

  public async appendProperty(
    identifier: string,
    required: boolean,
    value?: string,
    method = false,
    department = false,
  ) {
    value = this.getType(value); // Transforms type before passing to cart.
    const code = await this.cartridge.dispatch({
      type: CartEventName.SetProperty,
      value,
      identifier,
      required,
      method,
      department,
    });
    if (code === null) return;
    this.append(code);
  }

  public async appendClosingStruct() {
    const code = await this.cartridge.dispatch({
      type: CartEventName.StructClose,
    });
    if (code === null) return;
    this.append(code);
  }

  public async appendComment(comment: string, line: number, column: number) {
    const code = await this.cartridge.dispatch({
      type: CartEventName.Comment,
      comment,
      line,
      column,
    });
    if (code === null) return;
    this.append(code);
  }

  toString = this.export.bind(this);

  public async export(): Promise<string> {
    if (this.currentIndentLevel > 0) return "";
    const topOfFile = await this.cartridge.dispatch({
      type: CartEventName.FileStart,
    });
    const bottomOfFile = await this.cartridge.dispatch({
      type: CartEventName.FileEnd,
    });
    return BoC.join(topOfFile, ...this.blocks, bottomOfFile);
  }

  public getType(
    alias?: string,
  ): string | undefined {
    if (alias === undefined) return undefined;
    switch (alias) {
      case ReservedType.Number:
        return this.typemap[ReservedType.Number];
      case ReservedType.String:
        return this.typemap[ReservedType.String];
      case ReservedType.Boolean:
        return this.typemap[ReservedType.Boolean];
      case ReservedType.Default:
        return this.typemap[ReservedType.Default];
      default: {
        return alias.replace(OMIT_PATTERN, "void") ?? "";
      }
    }
  }
}
