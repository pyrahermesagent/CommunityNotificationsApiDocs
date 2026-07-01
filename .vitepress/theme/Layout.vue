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
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1 !important;
}

/* Force nav-title to display with dimensions */
.nav-title {
  display: inline !important;
  white-space: nowrap !important;
  overflow: visible !important;
  text-overflow: clip !important;
  max-width: none !important;
  min-width: 0 !important;
  width: auto !important;
  font-weight: 700 !important;
  font-size: inherit !important;
  color: var(--vp-c-text-1) !important;
  font-family: inherit !important;
  letter-spacing: inherit !important;
  visibility: visible !important;
  opacity: 1 !important;
  z-index: 1 !important;
  position: relative !important;
}

.nav-logo {
  height: 28px !important;
  width: auto !important;
  object-fit: contain !important;
  flex-shrink: 0 !important;
  display: block !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Make sure parent containers don't hide the nav-title */
.VPNavBarTitle .title {
  overflow: visible !important;
  max-width: none !important;
  min-width: 0 !important;
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