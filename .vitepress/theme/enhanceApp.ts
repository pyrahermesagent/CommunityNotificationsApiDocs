import { nextTick } from 'vue'

export default {
  enhance({ app, router, site }: { app: any; router: any; site: any }) {
    // Run after Vue app mounts
    nextTick(() => {
      try {
        // Method 1: Insert a rule directly into an existing stylesheet
        // insertRule beats ALL selector specificity
        if (document.styleSheets.length > 0) {
          const sheet = document.styleSheets[0]
          const rule = '.VPHero .container .main .heading .name{display:block !important;width:100% !important;max-width:none !important;text-align:center !important;white-space:normal !important;background:linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%) !important;-webkit-background-clip:text !important;-webkit-text-fill-color:transparent !important;background-clip:text !important;overflow:visible !important;word-break:break-all !important;padding:0 !important;line-height:1.25 !important;letter-spacing:-.025em !important;font-weight:900 !important;font-size:clamp(1.6rem,4.5vw,2.5rem) !important}'
          try {
            sheet.insertRule(rule, sheet.cssRules.length)
          } catch (e) {
            // insertRule may fail due to CSP; fall back to style element
            console.log('insertRule failed, using style element')
          }
        }
        
        // Method 2: Append style element
        const style = document.createElement('style')
        style.id = 'final-gradient'
        style.textContent = '.VPHero .container .main .heading .name{display:block !important;width:100% !important;max-width:none !important;text-align:center !important;white-space:normal !important;background:linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%) !important;-webkit-background-clip:text !important;-webkit-text-fill-color:transparent !important;background-clip:text !important;overflow:visible !important;word-break:break-all !important;padding:0 !important;line-height:1.25 !important;letter-spacing:-.025em !important;font-weight:900 !important;font-size:clamp(1.6rem,4.5vw,2.5rem) !important}'
        document.head.appendChild(style)
        
        // Method 3: Force inline styles on elements
        const name = document.querySelector('.VPHero .heading .name')
        if (name) {
          name.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)'
          name.style.webkitBackgroundClip = 'text'
          name.style.webkitTextFillColor = 'transparent'
          name.style.backgroundClip = 'text'
          name.style.display = 'block'
          name.style.width = '100%'
          name.style.maxWidth = 'none'
          name.style.textAlign = 'center'
          name.style.whiteSpace = 'normal'
          name.style.overflow = 'visible'
          name.style.wordBreak = 'break-all'
          name.style.padding = '0'
          name.style.lineHeight = '1.25'
          name.style.letterSpacing = '-.025em'
          name.style.fontWeight = '900'
          name.style.fontSize = 'clamp(1.6rem,4.5vw,2.5rem)'
        }
        
        // Hide Documentation
        const text = document.querySelector('.VPHero .heading .text')
        if (text) text.style.display = 'none'
        
        // Hide sidebar
        const sidebar = document.querySelector('.VPSidebar')
        if (sidebar) sidebar.style.display = 'none'
        
        // Hide nav elements
        const hamburger = document.querySelector('.VPNavBarHamburger')
        if (hamburger) hamburger.style.display = 'none'
        const navScreen = document.querySelector('.VPNavScreen')
        if (navScreen) navScreen.style.display = 'none'
        const appearance = document.querySelector('.VPNavBarAppearance')
        if (appearance) appearance.style.display = 'none'
      } catch (e) {
        console.error('enhanceApp error:', e)
      }
    })
  }
}