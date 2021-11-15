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
  Comment,
  CommentOpener,
  CommentCloser,
  Unknown,
  EOF,
}

export const LEXICON = new Map<Lexicon, string | string[] | null>([
  [Lexicon.Identifier, null],
  [Lexicon.StructOpener, "{"],
  [Lexicon.StructCloser, "}"],
  [Lexicon.TupleOpener, "("],
  [Lexicon.TupleCloser, ")"],
  [Lexicon.TypeDefiner, ["type", "struct", "interface"]],
  [Lexicon.PropertyDefiner, ":"],
  [Lexicon.PropertyOptionalMarker, "?"],
  [Lexicon.PropertyOptionalDefiner, "?:"],
  [Lexicon.Modifier, "%"],
  [Lexicon.TextWrapper, ['"', "'", "`"]],
  [Lexicon.TextLiteral, null],
  [Lexicon.Comment, [";", "//"]],
  [Lexicon.CommentOpener, "/*"],
  [Lexicon.CommentCloser, "*/"],
  [Lexicon.Unknown, null],
  [Lexicon.EOF, null],
]);

// freezing LEXICON map into place, courtesy of https://stackoverflow.com/a/35776333
LEXICON.set = function (key) {
  throw new Error("Can't add property " + key + ", map is not extensible");
};
LEXICON.delete = function (key) {
  throw new Error("Can't delete property " + key + ", map is frozen");
};
LEXICON.clear = function () {
  throw new Error("Can't clear map, map is frozen");
};
