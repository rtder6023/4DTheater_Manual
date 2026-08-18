<script setup>
defineProps({
  tocGroups: { type: Array, required: true },
  activeId: { type: String, required: true },
  open: { type: Boolean, default: false },
});

defineEmits(["navigate"]);
</script>

<template>
  <nav class="sidebar" :class="{ open }" aria-label="목차">
    <div class="brand">
      <span class="brand-eyebrow">Operations Manual</span>
      <span class="brand-title">4DX 키오스크</span>
      <span class="brand-sub">설치 · 설정 · 사용 매뉴얼</span>
    </div>

    <div class="toc-group" v-for="group in tocGroups" :key="group.label">
      <div class="toc-label">{{ group.label }}</div>
      <a
        v-for="item in group.items"
        :key="item.id"
        :href="'#' + item.id"
        :class="{ active: activeId === item.id }"
        @click="$emit('navigate')"
      >{{ item.label }}</a>
    </div>
  </nav>
</template>
