export const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
] as const;

export type SupportedModel = typeof GEMINI_MODELS[number];

export class ModelRegistry {
  static getPreferredModels(): readonly string[] {
    return GEMINI_MODELS;
  }
}

