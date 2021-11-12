// https://github.com/EthanThatOneKid/fart/blob/main/lib/consts/lexicon.ts
export enum Lexicon {
  Identifier,
  StructOpener,
  StructCloser,
  TupleOpener,
  TupleCloser,
  TypeDefiner,
  PropertyDefiner,
  PropertyOptionalMarker,
  Modifier,
  TextWrapper,
  Comment,
  Unknown,
  EOF,
}

export const LEXICON = {
  [Lexicon.Identifier]: null,
  [Lexicon.StructOpener]: "{",
  [Lexicon.StructCloser]: "}",
  [Lexicon.TupleOpener]: "(",
  [Lexicon.TupleCloser]: ")",
  [Lexicon.TypeDefiner]: ["type", "struct", "interface"],
  [Lexicon.PropertyDefiner]: ":",
  [Lexicon.PropertyOptionalMarker]: "?",
  [Lexicon.Modifier]: ["%", "mod"],
  [Lexicon.TextWrapper]: ['"', "'", "`"],
  [Lexicon.Comment]: [";", "//"],
  [Lexicon.Unknown]: null,
  [Lexicon.EOF]: null,
} as const;
