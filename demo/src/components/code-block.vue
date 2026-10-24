<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

const props = withDefaults(defineProps<{ code: string; filename?: string }>(), {
  filename: "Example.vue",
});
const feedback = ref("");
let timer: ReturnType<typeof setTimeout> | undefined;

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    feedback.value = "Copied!";
  } catch {
    feedback.value = "Select the code below to copy.";
  }
  clearTimeout(timer);
  timer = setTimeout(() => (feedback.value = ""), 3000);
};

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="code-block">
    <div class="code-toolbar">
      <span class="code-filename">{{ filename }}</span>
      <span class="copy-feedback" role="status">{{ feedback }}</span>
      <button
        class="code-copy"
        type="button"
        :aria-label="`Copy ${filename}`"
        @click="copy"
      >
        {{ feedback === "Copied!" ? "✓ Copied" : "Copy code" }}
      </button>
    </div>
    <pre
      tabindex="0"
      :aria-label="`${filename} source code`"
    ><code>{{ code }}</code></pre>
  </div>
</template>
