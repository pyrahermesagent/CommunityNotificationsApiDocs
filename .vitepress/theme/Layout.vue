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
/* ========== Nav Brand ========== */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.15rem;
  white-space: nowrap;
}

.nav-logo {
  height: 28px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.nav-logo:hover {
  transform: scale(1.05);
}

.nav-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

/* Hide the redundant VitePress default title (the site name that VitePress auto-inserts) */
.VPNavBarTitle .title span:first-child {
  display: none !important;
}

/* ========== Header overflow fix ========== */
/* Override the gradient text effect that VitePress gives the title span */
.VPNavBarTitle .title {
  background: none !important;
  -webkit-background-clip: none !important;
  -webkit-text-fill-color: unset !important;
  background-clip: none !important;
}

.VPNavBarTitle .title a {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ========== Hero centering ========== */
.VPHero .main {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.VPHero .heading {
  text-align: center;
}

.VPHero .tagline {
  text-align: center;
}

.VPHero .actions {
  justify-content: center;
}

/* ========== Feature cards centering ========== */
.VPHomeFeatures .container {
  display: flex;
  justify-content: center;
}

/* ========== Mobile ========== */
@media (max-width: 768px) {
  .nav-brand {
    gap: 6px;
    font-size: 1rem;
  }
  
  .nav-logo {
    height: 24px;
  }
  
  .nav-title {
    display: none;
  }
}

@media (max-width: 400px) {
  .nav-brand {
    gap: 4px;
  }
  
  .nav-logo {
    height: 22px;
  }
}
</style>