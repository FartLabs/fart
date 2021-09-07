export enum CartEvent {
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
export interface CartHandlerMap {
  [CartEvent.Import]: (
    src: string,
    dependencies: string[],
  ) => string | string[] | string[][] | null;
  [CartEvent.StructOpen]: (
    id: string,
    depo?: boolean,
  ) => string | string[] | string[][] | null;
  [CartEvent.SetProperty]: (
    id: string,
    required?: boolean,
    type?: string,
  ) => string | string[] | string[][] | null;
  [CartEvent.SetMethod]: (
    id: string,
    detail?: MethodDetails,
  ) => string | string[] | string[][] | null;
  [CartEvent.StructClose]: (
    depo?: boolean,
  ) => string | string[] | string[][] | null;
}

export class Cart {
  constructor(
    private handlers = {
      [CartEvent.Import]: undefined as
        | CartHandlerMap[CartEvent.Import]
        | undefined,
      [CartEvent.StructOpen]: undefined as
        | CartHandlerMap[CartEvent.StructOpen]
        | undefined,
      [CartEvent.SetProperty]: undefined as
        | CartHandlerMap[CartEvent.SetProperty]
        | undefined,
      [CartEvent.SetMethod]: undefined as
        | CartHandlerMap[CartEvent.SetMethod]
        | undefined,
      [CartEvent.StructClose]: undefined as
        | CartHandlerMap[CartEvent.StructClose]
        | undefined,
    },
  ) {}

  addEventListener(
    event: CartEvent.Import,
    callback: CartHandlerMap[CartEvent.Import],
  ): void;
  addEventListener(
    event: CartEvent.StructOpen,
    callback: CartHandlerMap[CartEvent.StructOpen],
  ): void;
  addEventListener(
    event: CartEvent.SetProperty,
    callback: CartHandlerMap[CartEvent.SetProperty],
  ): void;
  addEventListener(
    event: CartEvent.SetMethod,
    callback: CartHandlerMap[CartEvent.SetMethod],
  ): void;
  addEventListener(
    event: CartEvent.StructClose,
    callback: CartHandlerMap[CartEvent.StructClose],
  ): void;
  addEventListener(
    event: CartEvent,
    callback: CartHandlerMap[CartEvent],
  ): void {
    switch (event) {
      case CartEvent.Import: {
        this.handlers[event] = callback as CartHandlerMap[CartEvent.Import];
        break;
      }
      case CartEvent.StructOpen: {
        this.handlers[event] = callback as CartHandlerMap[CartEvent.StructOpen];
        break;
      }
      case CartEvent.SetProperty: {
        this.handlers[event] =
          callback as CartHandlerMap[CartEvent.SetProperty];
        break;
      }
      case CartEvent.SetMethod: {
        this.handlers[event] = callback as CartHandlerMap[CartEvent.SetMethod];
        break;
      }
      case CartEvent.StructClose: {
        this.handlers[event] =
          callback as CartHandlerMap[CartEvent.StructClose];
        break;
      }
    }
  }

  dispatch(
    event: CartEvent.Import,
    ...args: Parameters<CartHandlerMap[CartEvent.Import]>
  ): ReturnType<CartHandlerMap[CartEvent.Import]>;
  dispatch(
    event: CartEvent.StructOpen,
    ...args: Parameters<CartHandlerMap[CartEvent.StructOpen]>
  ): ReturnType<CartHandlerMap[CartEvent.StructOpen]>;
  dispatch(
    event: CartEvent.SetProperty,
    ...args: Parameters<CartHandlerMap[CartEvent.SetProperty]>
  ): ReturnType<CartHandlerMap[CartEvent.SetProperty]>;
  dispatch(
    event: CartEvent.SetMethod,
    ...args: Parameters<CartHandlerMap[CartEvent.SetMethod]>
  ): ReturnType<CartHandlerMap[CartEvent.SetMethod]>;
  dispatch(
    event: CartEvent.StructClose,
    ...args: Parameters<CartHandlerMap[CartEvent.StructClose]>
  ): ReturnType<CartHandlerMap[CartEvent.StructClose]>;
  dispatch(
    event: CartEvent,
    ...args: Parameters<CartHandlerMap[CartEvent]>
  ): string | string[] | string[][] | null {
    switch (event) {
      case CartEvent.Import: {
        const handler = this.handlers[CartEvent.Import];
        if (handler !== undefined) {
          const [source, dependencies] = args;
          return handler(source as string, dependencies as string[]);
        }
        return null;
      }
      case CartEvent.StructOpen: {
        const handler = this.handlers[CartEvent.StructOpen];
        if (handler !== undefined) {
          const [id, depo] = args;
          return handler(id as string, depo as boolean | undefined);
        }
        return null;
      }
      case CartEvent.SetProperty: {
        const handler = this.handlers[CartEvent.SetProperty];
        if (handler !== undefined) {
          const [id, required, type] = args;
          return handler(id as string, required as boolean | undefined, type);
        }
        return null;
      }
      case CartEvent.SetMethod: {
        const handler = this.handlers[CartEvent.SetMethod];
        if (handler !== undefined) {
          const [source, detail] = args;
          return handler(source as string, detail as MethodDetails | undefined);
        }
        return null;
      }
      case CartEvent.StructClose: {
        const handler = this.handlers[CartEvent.StructClose];
        const [depo] = args;
        if (handler !== undefined) return handler(depo as boolean);
        return null;
      }
    }
  }

  removeEventListener(event: CartEvent) {
    delete this.handlers[event];
  }
}
