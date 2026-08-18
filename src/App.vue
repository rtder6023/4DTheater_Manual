<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import TocSidebar from "./components/TocSidebar.vue";
import ManualChapter from "./components/ManualChapter.vue";
import { chapters, tocGroups } from "./data/chapters.js";

const activeId = ref(chapters[0].id);
const navOpen = ref(false);
const progress = ref(0);
let observer = null;

function updateProgress() {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.value =
    max > 0 ? Math.min(100, Math.max(0, (scrollTop / max) * 100)) : 0;
}

onMounted(() => {
  nextTick(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id;
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    chapters.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });
  });
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  window.removeEventListener("scroll", updateProgress);
});
</script>

<template>
  <div class="progress-bar" :style="{ width: progress + '%' }"></div>

  <div class="layout">
    <button
      class="nav-toggle"
      type="button"
      @click="navOpen = !navOpen"
      :aria-expanded="navOpen ? 'true' : 'false'"
    >
      <span>{{ navOpen ? "✕ 닫기" : "☰ 목차" }}</span>
    </button>

    <TocSidebar
      :toc-groups="tocGroups"
      :active-id="activeId"
      :open="navOpen"
      @navigate="navOpen = false"
    />

    <main>
      <header class="doc-header">
        <div class="doc-kicker">4DX Theater Kiosk System</div>
        <h1>독립기념관 키오스크 설치 매뉴얼</h1>
        <p>
          이 문서만 보고 무인 예매 키오스크의 설치부터 영수증 프린터 연결,
          운영(관리자 페이지) 까지 전부 진행할 수 있도록 순서대로 정리했습니다.
          기술 지식이 없어도 따라 하실 수 있습니다.
        </p>
      </header>

      <ManualChapter v-for="ch in chapters" :key="ch.id" :chapter="ch" />

      <footer class="doc-footer">4DX 키오스크 시스템 · 설치·운영 매뉴얼</footer>
    </main>
  </div>
</template>
