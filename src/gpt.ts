import {
  ChatSession,
  InferenceModel,
  createCompletion,
  loadModel,
} from "gpt4all";

export interface GptOptions {
  model: string;
  device?: string;
  temperature?: number;
  systemPrompt?: string;
  topP?: number;
  minP?: number;
  topK?: number;
  threadCount?: number;
  contextLength?: number;
}

export function fromEnv(): GptOptions {
  return {
    model: process.env.GPT_MODEL!,
    device: process.env.GPT_DEVICE,
    temperature: process.env.GPT_TEMPERATURE
      ? parseFloat(process.env.GPT_TEMPERATURE)
      : undefined,
    systemPrompt: process.env.GPT_SYSTEM_PROMPT || undefined,
    topP: process.env.GPT_TOP_P ? parseFloat(process.env.GPT_TOP_P) : undefined,
    minP: process.env.GPT_MIN_P ? parseFloat(process.env.GPT_MIN_P) : undefined,
    topK: process.env.GPT_TOP_K ? parseInt(process.env.GPT_TOP_K) : undefined,
    threadCount: process.env.GPT_THREAD_COUNT
      ? parseInt(process.env.GPT_THREAD_COUNT)
      : undefined,
    contextLength: process.env.GPT_CONTEXT_LENGTH
      ? parseInt(process.env.GPT_CONTEXT_LENGTH)
      : undefined,
  };
}

export function validateOptions(options: GptOptions): void {
  if (!options.model) {
    options.model = "mistral-7b-instruct-v0.1.Q4_0.gguf";
  }
}

export async function createChatSession(options: GptOptions): Promise<{
  model: InferenceModel;
  chat: ChatSession;
}> {
  validateOptions(options);
  console.error("requested options", JSON.stringify(options, null, 2));
  const modelOptions = {
    device: options.device || "auto",
    nCtx: options.contextLength || 2048,
    verbose: true,
  };
  console.error("model options", JSON.stringify(modelOptions, null, 2));
  const model = await loadModel(options.model, modelOptions);
  const threadCount = options.threadCount || 24;
  console.error("thread count", threadCount);
  model.llm.setThreadCount(threadCount);
  const chatOptions = {
    temperature: options.temperature || 0.7,
    systemPrompt: options.systemPrompt || "### System: You are an experienced mathematician and software developer\n",
    topP: options.topP || 0.4,
    minP: options.minP || 0,
    topK: options.topK || 40,
  };
  console.error("chat session options", JSON.stringify(chatOptions, null, 2));
  const chat = await model.createChatSession(chatOptions);
  process.on("SIGINT", () => {
    model.dispose();
  });
  return { model, chat };
}
