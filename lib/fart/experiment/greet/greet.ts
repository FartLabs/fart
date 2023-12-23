/**
 * DEFAULT_NAME is the default name to use when greeting someone.
 */
export const DEFAULT_NAME = "world";

/**
 * greet returns a greeting for the named person.
 */
export function greet(name: string = DEFAULT_NAME): string {
  return `Hello ${name}!`;
}
