<script setup lang="ts">
// import type { AsyncState } from "@/types";
const props = defineProps<{
  url: string;
  temperature: number;
}>();
const { chat, state, firstMessage } = useChatAi({ agent: "twitter" });
// const annoucement = ref("My generated tweet!");
const annoucement = computed(() => firstMessage.value?.content);
// const state = ref<AsyncState>("complete");
// const state = ref<AsyncState>("loading");
// const state = ref<AsyncState>("error");
const generate = () => nextTick(() => chat(props));
defineExpose({
  generate,
});
// pass on to twitter
const postURL = computed(
  () =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      annoucement.value || ""
    )}`
);
</script>
<template>
  <CardGeneric title="Twitter" :state="state" :body="annoucement" class="mb-10">
    <div class="flex w-full justify-between items-center">
      <div class="text-xs">
        Character Count:
        <strong>{{ annoucement?.length }}</strong>
      </div>
      <div>
        <button class="btn btn-neutral mr-2" @click="generate()">
          Regernate ""
        </button>
        <a class="btn btn-primary" :href="postURL" target="_blank">Post</a>
      </div>
    </div>
  </CardGeneric>
</template>
