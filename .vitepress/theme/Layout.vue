<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { onMounted } from 'vue'

const { site, isDark } = useData()

onMounted(() => {
  // Create a dedicated stylesheet for our overrides
  // Rules added via insertRule() are independent of selector specificity
  // When !important conflicts, LATER rule wins - our sheet loads after VitePress
  let overrideSheet
  
  try {
    // Create our own stylesheet and insert rules at the end
    overrideSheet = document.createElement('style')
    overrideSheet.id = 'vp-override'
    overrideSheet.textContent = ''
    document.head.appendChild(overrideSheet)
    
    // Get the sheet and insert rules
    // Rules at the end of a stylesheet have highest priority
    function addRule(selector, declarations) {
      try {
        const sheet = overrideSheet.sheet
        if (sheet) {
          const propStr = Object.entries(declarations).map(([k, v]) => `${k}: ${v} !important`).join('; ')
          sheet.insertRule(`${selector} { ${propStr} }`, sheet.cssRules.length)
        }
      } catch (e) {
        // insertRule may fail due to CSP or other issues
        console.warn('insertRule failed:', selector, e)
      }
    }
    
    // Apply overrides
    function applyOverrides() {
      // Hero name gradient
      addRule('.VPHero .container .main .heading .name', {
        'display': 'block',
        'width': '100%',
        'max-width': 'none',
        'text-align': 'center',
        'white-space': 'normal',
        'background': 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        'background-clip': 'text',
        'overflow': 'visible',
        'word-break': 'break-all',
        'line-height': '1.25',
        'letter-spacing': '-.025em',
        'font-weight': '900',
        'font-size': 'clamp(1.6rem, 4.5vw, 2.5rem)'
      })
      
      // Hide Documentation subtitle
      addRule('.VPHero .heading .text', {
        'display': 'none'
      })
      
      // Center tagline
      addRule('.VPHero .tagline', {
        'text-align': 'center',
        'margin-left': 'auto',
        'margin-right': 'auto',
        'display': 'block',
        'width': '100%'
      })
      
      // Features grid
      addRule('.VPHomeFeatures .container', {
        'display': 'grid',
        'grid-template-columns': 'repeat(3, 1fr)',
        'max-width': '1152px',
        'margin': '0 auto',
        'gap': '24px'
      })
      
      // Hide default nav spans (except .nav-title)
      addRule('.VPNavBarTitle .title > span:not(.nav-title)', {
        'display': 'none'
      })
      
      // Hide mobile nav elements
      addRule('.VPNavBarHamburger', { 'display': 'none' })
      addRule('.VPNavBarAppearance', { 'display': 'none' })
      addRule('.VPNavScreen', { 'display': 'none' })
      addRule('.outline-title', { 'display': 'none' })
      addRule('.outline-label', { 'display': 'none' })
      
      // Hide sidebar
      addRule('.VPSidebar', { 'display': 'none' })
    }
    
    applyOverrides()
    
    // Use MutationObserver to re-apply if VitePress re-renders
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        if (overrideSheet) applyOverrides()
      }, 100)
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    
  } catch (e) {
    console.error('Override setup failed:', e)
    
    // Fallback: try setProperty with !important
    const nameEl = document.querySelector('.VPHero .heading .name')
    if (nameEl) {
      nameEl.style.setProperty('background', 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', 'important')
    }
  }
})
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-title-after>
      <div class="nav-brand" style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:1.15rem;color:#374151;">
        <img class="nav-logo" :src="isDark ? '/CommunityNotificationsApiDocs/logo-lines-rounded-white.svg' : '/CommunityNotificationsApiDocs/logo-lines-rounded-black.svg'"
             alt="PlutoFramework"
             style="height:28px;width:auto;object-fit:contain;" />
        <span class="nav-title">{{ site.title }}</span>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>