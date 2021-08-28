export enum FartTarget {
  TypeScript = "ts",
  Go = "go",
  Basic = "bas",
}

export enum FartGrammar {
  Nester = "{",
  Denester = "}",
  Identifier = "",
  Setter = ":",
  ConstSetter = ":>",
  RequiredSetter = "*:",
  TypeDefiner = "type",
  DepoDefiner = "depo",
  ImpoDefiner = "impo",
  Commenter = ";",
  Seperator = ",",
  Spacer = " ",
  LineBreaker = "\n",
}

export enum FartIndentation {
  Tab = "\t",
  SingleSpace = " ",
  DoubleSpace = "  ",
  TripleSpace = "   ",
  QuadrupleSpace = "    ",
}

export interface FartSettings {
  target?: FartTarget;
  indentation?: FartIndentation;
  typemap?: Record<string, string>;
}

export interface FartLine {
  content: string;
  indentationLevel?: number; // Default: 0
}

export interface FartState {
  result: FartLine[];
  warnings: string[];
  errors: string[];
}
