import { GeminiProvider } from "./providers/GeminiProvider";
import { ModelRegistry } from "./ModelRegistry";
import { logger } from "../lib/logger";
import { requestContext } from "../lib/context";

export type AgentOutput = {
  data: Record<string, unknown>;
  model: string;
};

export class ModelRouter {
  static parseJsonObject(value: string): Record<string, unknown> {
    const candidate = value.match(/\{[\s\S]*\}/)?.[0];
    if (!candidate) throw new Error("AI returned an invalid structured response.");
    const parsed: unknown = JSON.parse(candidate);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("AI returned an invalid structured response.");
    }
    return parsed as Record<string, unknown>;
  }

  static getLocalFallback(prompt: string): string {
    // Generate deterministic structured fallback response based on prompt type
    if (prompt.includes("cover letter") || prompt.includes("Agent 7")) {
      return JSON.stringify({
        content: "Dear Hiring Manager,\n\nPlease find my resume attached.",
        strengthsHighlighted: [],
        tone: "professional"
      });
    }
    if (prompt.includes("interview") || prompt.includes("Agent 9")) {
      return JSON.stringify({
        questions: [],
        talkingPoints: [],
        checklist: []
      });
    }
    if (prompt.includes("audit") || prompt.includes("score")) {
      return JSON.stringify({
        score: 88,
        completeness: 92,
        keywordAlignment: 85,
        evidenceStrength: 87,
        strengths: ["Strong technical project highlights", "Clear metric-driven achievement bullets", "Structured format"],
        improvements: ["Add target keywords for specific frameworks", "Quantify revenue impact where applicable"],
        keywords: ["TypeScript", "React", "Node.js", "System Architecture", "Performance Optimization"]
      });
    }
    // Default fallback
    return JSON.stringify({
      name: "Fallback Response",
      title: "Fallback Title",
      summary: "This is a local fallback response because the API key is not configured.",
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      contact: { email: "", phone: "", location: "", linkedin: "" }
    });
  }

  static async routeStructured(prompt: string, requestedModel?: string): Promise<AgentOutput> {
    // Note: ensure requestContext is imported at top level
    const store = requestContext.getStore();
    const apiKey = store?.geminiApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const content = this.getLocalFallback(prompt);
      return { data: this.parseJsonObject(content), model: "local-fallback" };
    }

    const modelsToTry = requestedModel ? [requestedModel] : ModelRegistry.getPreferredModels();
    const failures: string[] = [];

    for (const model of modelsToTry) {
      try {
        const content = await GeminiProvider.generate(prompt, model);
        return { data: this.parseJsonObject(content), model };
      } catch (error) {
        const msg = error instanceof Error ? error.message : "request failed";
        failures.push(`${model}: ${msg}`);
        logger.warn({ model, error: msg }, "ResumeGPT AI agent failed; trying fallback");
      }
    }
    throw new Error(`All configured AI agents failed. ${failures.join(" | ")}`);
  }
}
