<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { site, isDark } = useData()
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-title-after>
      <div class="nav-brand">
        <img
          :src="isDark ? '/logo-lines-rounded-white.svg' : '/logo-lines-rounded-black.svg'"
          alt="PlutoFramework"
          class="nav-logo"
        />
        <span class="nav-title">{{ site.title }}</span>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<style>
/* Hide VitePress default title copies */
.VPNavBarTitle .title > span {
  display: none !important;
}
.VPNavBarTitle .title .text {
  display: none !important;
}

/* Nav brand styles */
.nav-brand {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-weight: 700 !important;
  font-size: 1.15rem !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  min-width: 0 !important;
}

.nav-title {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  display: inline !important;
}

.nav-logo {
  height: 28px !important;
  width: auto !important;
  object-fit: contain !important;
  flex-shrink: 0 !important;
  display: block !important;
}

@media (max-width: 768px) {
  .nav-brand {
    gap: 6px !important;
    font-size: 1rem !important;
  }
  .nav-logo {
    height: 24px !important;
  }
  .nav-title {
    font-size: 0.85rem !important;
  }
}

@media (max-width: 400px) {
  .nav-brand {
    gap: 4px !important;
  }
  .nav-logo {
    height: 22px !important;
  }
}

/* Hero image styling */
.VPHero .image img {
  max-width: 200px !important;
  height: auto !important;
}
</style>