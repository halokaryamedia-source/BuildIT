export interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
  images?: string[];
}

export interface OllamaOptions {
  baseUrl: string;
  model: string;
}

export class OllamaProvider {
  constructor(private readonly options: OllamaOptions) {}

  async health(): Promise<boolean> {
    try {
      const response = await fetch(this.options.baseUrl + "/api/tags");
      return response.ok;
    } catch {
      return false;
    }
  }

  async chat(messages: OllamaMessage[]): Promise<string> {
    const response = await fetch(this.options.baseUrl + "/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: this.options.model,
        stream: false,
        messages
      })
    });

    if (!response.ok) {
      throw new Error("Ollama request failed with status " + response.status);
    }

    const data = (await response.json()) as { message?: { content?: string } };
    return data.message?.content ?? "";
  }
}
