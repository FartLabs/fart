export interface FartOptions {
  targetLanguage: "ts" | "go" | "json" | "html";
  codeCartridges: CodeCartridge[];
  indentation: number;
}

export const transpile = (code: string, options: FartOptions): string => {
};
