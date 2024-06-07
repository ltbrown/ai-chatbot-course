<script setup lang="ts">
// import type { AsyncState } from "@/types";
// const annoucement = ref("My generated post!");
// const state = ref<AsyncState>("complete");
// const state = ref<AsyncState>("loading");
// const state = ref<AsyncState>("error");

const props = defineProps<{
  url: string;
  temperature: number;
}>();
const { chat, state, firstMessage } = useChatAi({ agent: "facebook" });
const annoucement = computed(() => firstMessage.value?.content);
const generate = () => nextTick(() => chat(props));
defineExpose({
  generate,
});

// pass on to facebook
const postURL = computed(
  () =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      props.url
    )}`
);
// copy to clipboard functionality
const { copy } = useClipboard();
function post() {
  copy(annoucement.value || "");
  setTimeout(() => window.open(postURL.value, "_blank"), 500);
}
</script>
<template>
  <CardGeneric title="Facebook" :state="state" :body="annoucement">
    <div>
      <button class="btn btn-neutral mr-2" @click="generate()">
        Regernate
      </button>
      <a
        class="btn btn-primary"
        :href="postURL"
        target="_blank"
        @click.prevent="post"
        >Copy Announcment + Post</a
      >
    </div>
  </CardGeneric>
</template>
