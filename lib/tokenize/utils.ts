import { Lexicon } from "./lexicon.ts";

export const findInLexicon = (
  raw: string,
  lex: ReadonlyMap<Lexicon, string | string[] | null>,
): Lexicon | null => {
  for (const [kind, value] of lex) {
    if (Array.isArray(value) && value.includes(raw) || (raw === value)) {
      return kind;
    }
  }
  return null;
};

export const checkIsIdentifier = (candidate: string): boolean =>
  /^[a-zA-Z_$]\.*[a-zA-Z_$0-9]*$/g.test(candidate);

export const checkIsTextLiteral = (candidate: string): boolean =>
  /^\`(.*?)\`$/g.test(candidate) ||
  /^\'(.*?)\'$/g.test(candidate) ||
  /^\"(.*?)\"$/g.test(candidate);
