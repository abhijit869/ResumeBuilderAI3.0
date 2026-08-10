import { GoogleGenAI } from "@google/genai";
import { logger } from "../../lib/logger";
import { requestContext } from "../../lib/context";

const AI_REQUEST_TIMEOUT_MS = 60_000;

export class GeminiProvider {
  static async generate(prompt: string, model: string = "gemini-2.5-flash"): Promise<string> {
    const store = requestContext.getStore();
    const apiKey = store?.geminiApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
      // Basic response schema is guaranteed since ModelRouter parses it.
      // We instruct Gemini to return JSON.
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      });
      
      const content = response.text;
      if (!content) {
        throw new Error("Gemini returned an empty response.");
      }
      return content;
    } catch (error) {
      logger.error({ error }, "Gemini API request failed.");
      throw error;
    }
  }
}
