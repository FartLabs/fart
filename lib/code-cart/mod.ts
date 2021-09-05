export enum CodeCartEvent {
  Import = "import",
  StructOpen = "struct_open",
  SetProperty = "set_property",
  SetMethod = "set_method",
  StructClose = "struct_close",
}

export interface MethodDetails {
  required?: boolean;
  input?: string;
  output?: string;
}

/**
 * If a code generation function returns null, that means that the
 * target language omits the requested generated code. A null return
 * value will prevent the requested line from being appended to the result.
 */
export interface CodeCartHandlerMap {
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
}

export class CodeCart {
  constructor(
    private handlers = {
      [CodeCartEvent.Import]: undefined as
        | CodeCartHandlerMap[CodeCartEvent.Import]
        | undefined,
      [CodeCartEvent.StructOpen]: undefined as
        | CodeCartHandlerMap[CodeCartEvent.StructOpen]
        | undefined,
      [CodeCartEvent.SetProperty]: undefined as
        | CodeCartHandlerMap[CodeCartEvent.SetProperty]
        | undefined,
      [CodeCartEvent.SetMethod]: undefined as
        | CodeCartHandlerMap[CodeCartEvent.SetMethod]
        | undefined,
      [CodeCartEvent.StructClose]: undefined as
        | CodeCartHandlerMap[CodeCartEvent.StructClose]
        | undefined,
    },
  ) {}

  addEventListener(
    event: CodeCartEvent.Import,
    callback: CodeCartHandlerMap[CodeCartEvent.Import],
  ): void;
  addEventListener(
    event: CodeCartEvent.StructOpen,
    callback: CodeCartHandlerMap[CodeCartEvent.StructOpen],
  ): void;
  addEventListener(
    event: CodeCartEvent.SetProperty,
    callback: CodeCartHandlerMap[CodeCartEvent.SetProperty],
  ): void;
  addEventListener(
    event: CodeCartEvent.SetMethod,
    callback: CodeCartHandlerMap[CodeCartEvent.SetMethod],
  ): void;
  addEventListener(
    event: CodeCartEvent.StructClose,
    callback: CodeCartHandlerMap[CodeCartEvent.StructClose],
  ): void;
  addEventListener(
    event: CodeCartEvent,
    callback: CodeCartHandlerMap[CodeCartEvent],
  ): void {
    switch (event) {
      case CodeCartEvent.Import: {
        this.handlers[event] =
          callback as CodeCartHandlerMap[CodeCartEvent.Import];
        break;
      }
      case CodeCartEvent.StructOpen: {
        this.handlers[event] =
          callback as CodeCartHandlerMap[CodeCartEvent.StructOpen];
        break;
      }
      case CodeCartEvent.SetProperty: {
        this.handlers[event] =
          callback as CodeCartHandlerMap[CodeCartEvent.SetProperty];
        break;
      }
      case CodeCartEvent.SetMethod: {
        this.handlers[event] =
          callback as CodeCartHandlerMap[CodeCartEvent.SetMethod];
        break;
      }
      case CodeCartEvent.StructClose: {
        this.handlers[event] =
          callback as CodeCartHandlerMap[CodeCartEvent.StructClose];
        break;
      }
    }
  }

  dispatch(
    event: CodeCartEvent.Import,
    ...args: Parameters<CodeCartHandlerMap[CodeCartEvent.Import]>
  ): ReturnType<CodeCartHandlerMap[CodeCartEvent.Import]>;
  dispatch(
    event: CodeCartEvent.StructOpen,
    ...args: Parameters<CodeCartHandlerMap[CodeCartEvent.StructOpen]>
  ): ReturnType<CodeCartHandlerMap[CodeCartEvent.StructOpen]>;
  dispatch(
    event: CodeCartEvent.SetProperty,
    ...args: Parameters<CodeCartHandlerMap[CodeCartEvent.SetProperty]>
  ): ReturnType<CodeCartHandlerMap[CodeCartEvent.SetProperty]>;
  dispatch(
    event: CodeCartEvent.SetMethod,
    ...args: Parameters<CodeCartHandlerMap[CodeCartEvent.SetMethod]>
  ): ReturnType<CodeCartHandlerMap[CodeCartEvent.SetMethod]>;
  dispatch(
    event: CodeCartEvent.StructClose,
    ...args: Parameters<CodeCartHandlerMap[CodeCartEvent.StructClose]>
  ): ReturnType<CodeCartHandlerMap[CodeCartEvent.StructClose]>;
  dispatch(
    event: CodeCartEvent,
    ...args: Parameters<CodeCartHandlerMap[CodeCartEvent]>
  ): string | null {
    switch (event) {
      case CodeCartEvent.Import: {
        const handler = this.handlers[CodeCartEvent.Import];
        if (handler !== undefined) {
          const [source, dependencies] = args;
          return handler(source as string, dependencies as string[]);
        }
        return null;
      }
      case CodeCartEvent.StructOpen: {
        const handler = this.handlers[CodeCartEvent.StructOpen];
        if (handler !== undefined) {
          const [id, depo] = args;
          return handler(id as string, depo as boolean | undefined);
        }
        return null;
      }
      case CodeCartEvent.SetProperty: {
        const handler = this.handlers[CodeCartEvent.SetProperty];
        if (handler !== undefined) {
          const [id, required, type] = args;
          return handler(id as string, required as boolean | undefined, type);
        }
        return null;
      }
      case CodeCartEvent.SetMethod: {
        const handler = this.handlers[CodeCartEvent.SetMethod];
        if (handler !== undefined) {
          const [source, detail] = args;
          return handler(source as string, detail as MethodDetails | undefined);
        }
        return null;
      }
      case CodeCartEvent.StructClose: {
        const handler = this.handlers[CodeCartEvent.StructClose];
        const [depo] = args;
        if (handler !== undefined) return handler(depo as boolean);
        return null;
      }
    }
  }

  removeEventListener(event: CodeCartEvent) {
    this.handlers[event] = undefined;
  }
}
