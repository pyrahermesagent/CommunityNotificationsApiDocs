<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { site } = useData()
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-title-after>
      <div class="nav-brand">
        <img
          src="/plutolabs-logo-lines.svg"
          alt="PlutoFramework"
          class="nav-logo"
        />
        <span class="nav-title">{{ site.title }}</span>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.15rem;
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
}

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