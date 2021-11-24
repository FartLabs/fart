export enum Lexicon {
  Identifier,
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

export const LEXICON: ReadonlyMap<Lexicon, string | string[] | null> = new Map<
  Lexicon,
  string | string[] | null
>([
  [Lexicon.Identifier, null],
  [Lexicon.StructOpener, "{"],
  [Lexicon.StructCloser, "}"],
  [Lexicon.TupleOpener, "("],
  [Lexicon.TupleCloser, ")"],
  [Lexicon.TypeDefiner, ["type", "spec"]],
  [Lexicon.PropertyDefiner, ":"],
  [Lexicon.PropertyOptionalMarker, "?"],
  [Lexicon.PropertyOptionalDefiner, "?:"],
  [Lexicon.Modifier, "%"],
  [Lexicon.TextWrapper, ['"', "'", "`"]],
  [Lexicon.TextLiteral, null],
  [Lexicon.InlineComment, null],
  [Lexicon.MultilineComment, null],
  [Lexicon.Separator, ","],
  [Lexicon.Whitespace, " "],
  [Lexicon.Unknown, null],
  [Lexicon.EOF, "\n"],
]);

// force-freezing LEXICON map into place, courtesy of https://stackoverflow.com/a/35776333
(LEXICON as Map<unknown, unknown>).set = function (key) {
  throw new Error(`Can't add property ${key}, map is not extensible`);
};
(LEXICON as Map<unknown, unknown>).delete = function (key) {
  throw new Error(`Can't delete property ${key}, map is frozen`);
};
(LEXICON as Map<unknown, unknown>).clear = function () {
  throw new Error("Can't clear map, map is frozen");
};
