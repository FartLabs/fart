// TODO(ethanthatonekid): Allow for inclusive period characters in an "identifier".
export const validateIdentifier = (candidate: string): boolean =>
  /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(candidate);

export const validateStringLiteral = (candidate: string): boolean =>
  /^\`(.*?)\`$/g.test(candidate) ||
  /^\'(.*?)\'$/g.test(candidate) ||
  /^\"(.*?)\"$/g.test(candidate);
