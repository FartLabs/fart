export enum Lexeme {
  Identifier,
  Load,
  StructOpener,
  StructCloser,
  TupleOpener,
  TupleCloser,
  TypeDefiner,
  PropertyDefiner,
  PropertyOptionalMarker,
  PropertyOptionalDefiner,
  Modifier,
  TextWrapper,
  TextLiteral,
  InlineComment,
  MultilineComment,
  Separator,
  Whitespace,
  Unknown,
  EOF,
}

export type LexemeType = ReadonlyMap<Lexeme, string | string[] | null>;

export const LEXEME: LexemeType = new Map<
  Lexeme,
  string | string[] | null
>([
  [Lexeme.Identifier, null],
  [Lexeme.Load, "load"],
  [Lexeme.StructOpener, "{"],
  [Lexeme.StructCloser, "}"],
  [Lexeme.TupleOpener, "("],
  [Lexeme.TupleCloser, ")"],
  [Lexeme.TypeDefiner, ["type", "spec"]],
  [Lexeme.PropertyDefiner, ":"],
  [Lexeme.PropertyOptionalMarker, "?"],
  [Lexeme.PropertyOptionalDefiner, "?:"],
  [Lexeme.Modifier, "%"],
  [Lexeme.TextWrapper, ['"', "'", "`"]],
  [Lexeme.TextLiteral, null],
  [Lexeme.InlineComment, null],
  [Lexeme.MultilineComment, null],
  [Lexeme.Separator, ","],
  [Lexeme.Whitespace, " "],
  [Lexeme.Unknown, null],
  [Lexeme.EOF, "\n"],
]);

// force-freezing LEXEME map into place, courtesy of https://stackoverflow.com/a/35776333
(LEXEME as Map<unknown, unknown>).set = function (key) {
  throw new Error(`Can't add property ${key}, map is not extensible`);
};
(LEXEME as Map<unknown, unknown>).delete = function (key) {
  throw new Error(`Can't delete property ${key}, map is frozen`);
};
(LEXEME as Map<unknown, unknown>).clear = function () {
  throw new Error("Can't clear map, map is frozen");
};
