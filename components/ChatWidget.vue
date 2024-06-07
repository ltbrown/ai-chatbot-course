<script setup lang="ts">
import type { Message, User } from "@/types";

const me = ref<User>({
  id: "user",
  avatar: "/avatar.jpg",
  name: "You",
});
const bot = ref<User>({
  id: "assistant",
  avatar: "/bot.jpg",
  name: "Botman",
});

const users = computed(() => [me.value, bot.value]);

const messages = ref<Message[]>([]);

const usersTyping = ref<User[]>([]);

// send messages to Chat API here
// and in the empty function below

// allows for context
// GPT-3 Turbo Max Tokens 4,906
// GPT-4 max tokens 8,192
// This token includes all messages in original request as well as the messages
// bot responds with and this might get long. Need to make sure we don't go over
// the token limit. Total all words in each of the meassages and make best guess
// that each word is a token. This is a rough estimate but should be good enough.
// If we go over the token limit we can just send the last two messages.
// finish_reason: "length" means we hit the token limit
const messagesForApi = computed(
  () =>
    messages.value
      .map((m) => ({
        role: m.userId,
        content: m.text,
      }))
      .slice(-2) // only send last two messages
);

async function handleNewMessage(message: Message) {
  messages.value.push(message);
  usersTyping.value.push(bot.value);
  // send message to Chat API here
  const res = await $fetch("/api/ai", {
    method: "POST",
    body: {
      // messages: [{ role: "user", content: message.text }],
      // allows for contenxt
      messages: messagesForApi.value,
    },
  });
  if (!res.choices[0].message?.content) return;
  const msg = {
    id: res.id,
    userId: bot.value.id,
    createdAt: new Date(),
    text: res.choices[0].message?.content,
  };
  messages.value.push(msg);

  usersTyping.value = [];
}
</script>
<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="messages"
    @new-message="handleNewMessage"
    :usersTyping="usersTyping"
  />
</template>
