import type { Agent } from "@/agents";
import type { AsyncState } from "@/types";

// if using openai v4 use the following import instead:
// import type OpenAI from "openai";
import type { CreateChatCompletionResponse } from "openai";

export const useChatAi = ({ agent }: { agent: Agent }) => {
  const state = ref<AsyncState>(null);
  const error = ref();

  // if using openai v4, define the ref as the following type instead
  // const res = ref<OpenAI.Chat.Completions.ChatCompletion>();
  const res = ref<CreateChatCompletionResponse>();

  const usage = computed(() => res.value?.usage);
  const choices = computed(() => res.value?.choices || []);
  const hasChoices = computed(() => choices.value.length);
  const firstChoice = computed(() => choices.value.at(0));
  const firstMessage = computed(() => firstChoice.value?.message);

  async function chat(options: Record<string, any>) {
    try {
      state.value = "loading";

      // if using openai v4, the fetch response should be the following type instead
      // const result = await fetchWithTimeout<OpenAI.Chat.Completions.ChatCompletion>(
      const result = await fetchWithTimeout<CreateChatCompletionResponse>(
        `/api/ai`,
        {
          method: "POST",
          body: {
            ...options,
            agent: `${agent}Agent`,
          },
        }
      );
      if (!result.choices || !result.usage) {
        throw new Error("Invalid AI response");
      }

      res.value = result;
      state.value = "complete";
      return res.value;
    } catch (err) {
      state.value = "error";
      error.value = err;
    }
  }

  return {
    state,
    chat,
    choices,
    usage,
    firstChoice,
    hasChoices,
    firstMessage,
    res,
  };
};
