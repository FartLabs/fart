import { Lexicon } from "./lexicon.ts";

export const findInLexicon = (
  raw: string | null,
  lex: ReadonlyMap<Lexicon, string | string[] | null>,
): Lexicon | null => {
  if (raw === null) return null;
  for (const [kind, value] of lex) {
    if (Array.isArray(value) && value.includes(raw) || (raw === value)) {
      return kind;
    }
  }
  return null;
};

export const checkIsIdentifier = (candidate: string): boolean =>
  /^[a-zA-Z_$][a-zA-Z0-9\._$]*$/.test(candidate);

export const checkIsTextLiteral = (candidate: string): boolean => {
  return (candidate.startsWith("`") && candidate.endsWith("`")) ||
    (candidate.startsWith("'") && candidate.endsWith("'")) ||
    (candidate.startsWith('"') && candidate.endsWith('"'));
};

export const checkIsInlineComment = (candidate: string): boolean =>
  candidate.startsWith(";");

export const checkIsMultilineComment = (candidate: string): boolean => {
  return candidate.startsWith("/*") && candidate.endsWith("*/");
};
