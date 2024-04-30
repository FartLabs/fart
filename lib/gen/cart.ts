import { BoC } from "./common.ts";

export enum CartEventName {
  FileStart = "file_start",
  Import = "import",
  StructOpen = "struct_open",
  SetProperty = "set_property",
  StructClose = "struct_close",
  FileEnd = "file_end",
  Comment = "comment",
}

interface CartEventDetail {
  type: CartEventName;
  code: BoC;
  implementationPathname: string | null;
  comments: string[];
}

interface FileStartDetail extends CartEventDetail {
  type: CartEventName.FileStart;
}

interface StructCloseDetail extends CartEventDetail {
  type: CartEventName.StructClose;
}

interface FileEndDetail extends CartEventDetail {
  type: CartEventName.FileEnd;
}

interface ImportDetail extends CartEventDetail {
  type: CartEventName.Import;
  source: string;
  dependencies: string[];
}

interface StructOpenDetail extends CartEventDetail {
  type: CartEventName.StructOpen;
  identifier: string;
  department: boolean;
}

interface SetPropertyDetail extends CartEventDetail {
  type: CartEventName.SetProperty;
  identifier: string;
  department: boolean;
  value?: string;
  required: boolean;
  method: boolean;
}

interface CommentDetail {
  type: CartEventName.Comment;
  code: BoC;
  comment: string;
  line: number;
  column: number;
}

export type CartDispatch = {
  type: CartEventName.FileStart;
  implementationPathname: string | null;
} | {
  type: CartEventName.StructClose;
  implementationPathname: string | null;
} | {
  type: CartEventName.FileEnd;
  implementationPathname: string | null;
} | {
  type: CartEventName.Import;
  implementationPathname: string | null;
  source: string;
  dependencies: string[];
  comments: string[];
} | {
  type: CartEventName.StructOpen;
  implementationPathname: string | null;
  identifier: string;
  department: boolean;
  comments: string[];
} | {
  type: CartEventName.SetProperty;
  implementationPathname: string | null;
  identifier: string;
  department: boolean;
  value?: string;
  required: boolean;
  method: boolean;
} | {
  type: CartEventName.Comment;
  comment: string;
  line: number;
  column: number;
};

export type CartEvent =
  | FileStartDetail
  | StructCloseDetail
  | FileEndDetail
  | ImportDetail
  | StructOpenDetail
  | SetPropertyDetail
  | CommentDetail;

/**
 * If a code generation function returns null, that means that the
 * target language omits the requested generated code. A null return
 * value will prevent the requested line from being appended to the result.
 */
export type CartHandler<T extends CartEventName> = (
  event: T extends CartEventName.FileStart ? FileStartDetail
    : T extends CartEventName.Import ? ImportDetail
    : T extends CartEventName.StructOpen ? StructOpenDetail
    : T extends CartEventName.SetProperty ? SetPropertyDetail
    : T extends CartEventName.StructClose ? StructCloseDetail
    : T extends CartEventName.FileEnd ? FileEndDetail
    : CommentDetail,
) => void | Promise<void>;

export class Cart {
  constructor(
    private handlers = {
      [CartEventName.FileStart]: undefined as
        | CartHandler<CartEventName.FileStart>
        | undefined,
      [CartEventName.Import]: undefined as
        | CartHandler<CartEventName.Import>
        | undefined,
      [CartEventName.StructOpen]: undefined as
        | CartHandler<CartEventName.StructOpen>
        | undefined,
      [CartEventName.SetProperty]: undefined as
        | CartHandler<CartEventName.SetProperty>
        | undefined,
      [CartEventName.StructClose]: undefined as
        | CartHandler<CartEventName.StructClose>
        | undefined,
      [CartEventName.FileEnd]: undefined as
        | CartHandler<CartEventName.FileEnd>
        | undefined,
      [CartEventName.Comment]: undefined as
        | CartHandler<CartEventName.Comment>
        | undefined,
    },
  ) {}

  async dispatch(event: CartDispatch): Promise<BoC | null> {
    const handler = this.handlers[event.type];
    if (handler === undefined) return null;
    const code = new BoC();
    let result: void | Promise<void>;
    switch (event.type) {
      case CartEventName.FileStart: {
        result = (handler as CartHandler<CartEventName.FileStart>)({
          code,
          comments: [],
          ...event,
        });
        break;
      }
      case CartEventName.Import: {
        result = (handler as CartHandler<CartEventName.Import>)({
          code,
          ...event,
        });
        break;
      }
      case CartEventName.StructOpen: {
        result = (handler as CartHandler<CartEventName.StructOpen>)({
          code,
          ...event,
        });
        break;
      }
      case CartEventName.SetProperty: {
        result = (handler as CartHandler<CartEventName.SetProperty>)({
          code,
          comments: [],
          ...event,
        });
        break;
      }
      case CartEventName.StructClose: {
        result = (handler as CartHandler<CartEventName.StructClose>)({
          code,
          comments: [],
          ...event,
        });
        break;
      }
      case CartEventName.FileEnd: {
        result = (handler as CartHandler<CartEventName.FileEnd>)({
          code,
          comments: [],
          ...event,
        });
        break;
      }
      case CartEventName.Comment: {
        result = (handler as CartHandler<CartEventName.Comment>)({
          code,
          ...event,
        });
        break;
      }
    }
    if (result instanceof Promise) await result;
    return code;
  }

  addEventListener(
    name: CartEventName.FileStart,
    handler: CartHandler<CartEventName.FileStart>,
  ): void;
  addEventListener(
    name: CartEventName.Import,
    handler: CartHandler<CartEventName.Import>,
  ): void;
  addEventListener(
    name: CartEventName.StructOpen,
    handler: CartHandler<CartEventName.StructOpen>,
  ): void;
  addEventListener(
    name: CartEventName.SetProperty,
    handler: CartHandler<CartEventName.SetProperty>,
  ): void;
  addEventListener(
    name: CartEventName.StructClose,
    handler: CartHandler<CartEventName.StructClose>,
  ): void;
  addEventListener(
    name: CartEventName.FileEnd,
    handler: CartHandler<CartEventName.FileEnd>,
  ): void;
  addEventListener(
    name: CartEventName.Comment,
    handler: CartHandler<CartEventName.Comment>,
  ): void;
  addEventListener(
    name: CartEventName,
    // deno-lint-ignore no-explicit-any
    handler: any,
  ): void {
    this.handlers[name] = handler;
  }

  // `on` serves as an alias for `addEventListener`.
  on = this.addEventListener.bind(this);

  removeEventListener(name: CartEventName) {
    delete this.handlers[name];
  }
}
