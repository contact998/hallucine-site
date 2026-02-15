import { describe, it, expect, vi } from "vitest";

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: "Bonjour ! Je suis l'assistant Hallucine. Comment puis-je vous aider ?",
        },
      },
    ],
  }),
}));

import { chatWithAssistant } from "./chatbot";

describe("chatWithAssistant", () => {
  it("should return a string response for a simple user message", async () => {
    const messages = [{ role: "user" as const, content: "Bonjour" }];
    const response = await chatWithAssistant(messages);
    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0);
  });

  it("should return a string response for a product question", async () => {
    const messages = [
      { role: "user" as const, content: "Quel écran pour un mariage ?" },
    ];
    const response = await chatWithAssistant(messages);
    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0);
  });

  it("should handle multi-turn conversation", async () => {
    const messages = [
      { role: "user" as const, content: "Bonjour" },
      { role: "assistant" as const, content: "Bonjour ! Comment puis-je vous aider ?" },
      { role: "user" as const, content: "Je cherche un écran pour un festival" },
    ];
    const response = await chatWithAssistant(messages);
    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0);
  });

  it("should return a fallback message when LLM returns unexpected format", async () => {
    const { invokeLLM } = await import("./_core/llm");
    (invokeLLM as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      choices: [{ message: { content: null } }],
    });
    const messages = [{ role: "user" as const, content: "Test" }];
    const response = await chatWithAssistant(messages);
    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0);
  });

  it("should return error message when LLM throws", async () => {
    const { invokeLLM } = await import("./_core/llm");
    (invokeLLM as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("API Error")
    );
    const messages = [{ role: "user" as const, content: "Test" }];
    const response = await chatWithAssistant(messages);
    expect(typeof response).toBe("string");
    expect(response).toContain("erreur");
  });
});
