export enum LanguageTarget {
  TypeScript = "ts",
  Go = "go",
  Basic = "bas",
}

export enum Lexicon {
  Nester = "{",
  Denester = "}",
  Setter = ":",
  RequiredSetter = "*:",
  TypeDefiner = "type",
  ImpoDefiner = "impo",
  Commenter = ";",
  Separator = ",",
  Spacer = " ",
  LineBreaker = "\n",
  StringLiteral = "\`",
  EOF = "",
}

export enum IndentationSetting {
  Tab = "\t",
  SingleSpace = " ",
  DoubleSpace = "  ",
  TripleSpace = "   ",
  QuadrupleSpace = "    ",
}

export interface FartSettings {
  target?: LanguageTarget;
  indentation?: IndentationSetting;
  typemap?: Record<string, string>;
}
