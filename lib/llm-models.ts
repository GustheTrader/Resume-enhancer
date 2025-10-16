
// LLM Model configurations for different providers

export const LLM_MODELS = {
  openai: [
    { value: "gpt-4o", label: "GPT-4o", description: "Most capable, best quality" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini", description: "Balanced speed and quality" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo", description: "Advanced reasoning" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", description: "Fast and cost-effective" },
  ],
  anthropic: [
    { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet", description: "Best overall performance" },
    { value: "claude-3-opus-20240229", label: "Claude 3 Opus", description: "Most powerful" },
    { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet", description: "Balanced performance" },
    { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku", description: "Fast and efficient" },
  ],
  gemini: [
    { value: "gemini-flash-latest", label: "Gemini Flash Latest", description: "Latest hybrid model with 1M token context" },
    { value: "gemini-flash-lite-latest", label: "Gemini Flash-Lite Latest", description: "Most cost effective, built for scale" },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", description: "Hybrid model with 1M token context" },
    { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite", description: "Small and cost effective model" },
    { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash (Experimental)", description: "Experimental model" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", description: "Most capable" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", description: "Fast responses" },
    { value: "gemini-1.0-pro", label: "Gemini 1.0 Pro", description: "Stable version" },
  ],
};

export function getModelsForProvider(provider: string) {
  return LLM_MODELS[provider as keyof typeof LLM_MODELS] || [];
}

export function getDefaultModel(provider: string) {
  const models = getModelsForProvider(provider);
  return models[0]?.value || "";
}
