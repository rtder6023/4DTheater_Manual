<script setup>
defineProps({
  chapter: { type: Object, required: true },
});
</script>

<template>
  <hr v-if="chapter.divider" class="divider" />
  <section :id="chapter.id" class="chapter">
    <div class="chapter-num">{{ chapter.num }}</div>
    <h2>{{ chapter.title }}</h2>
    <p class="chapter-intro" v-if="chapter.intro">{{ chapter.intro }}</p>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="chapter.body"></div>
  </section>
</template>
