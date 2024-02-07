export function interpolate(
  template: string,
  data: Record<string, { toString(): string } | undefined>,
): string {
  let resultBuilder = "";
  let match: RegExpExecArray | null;
  const pattern = /\${([^}]+)}/g;

  while ((match = pattern.exec(template))) {
    const beforeMatch = template.slice(0, match.index);
    const placeholder = match[0];
    const key = match[1]?.trim();
    const value = data[key];

    if (value === undefined) {
      resultBuilder += beforeMatch + placeholder;
    } else {
      resultBuilder += beforeMatch + value.toString();
    }

    template = template.slice(match.index + placeholder.length);
  }

  resultBuilder += template;
  return resultBuilder;
}
