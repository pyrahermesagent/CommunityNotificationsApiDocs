import { defineConfig } from 'vitepress'
import theme from './theme/index.js'

export default defineConfig({
  title: 'CommunityNotificationsAPI',
  description: 'Notifications REST API Template — Documentation',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'How It Works', link: '/how-it-works' },
      { text: 'Setup Guide', link: '/setup' },
      { text: 'API Reference', link: '/api-reference' },
      { text: 'Code Examples', link: '/code-examples' },
      { text: 'Source Code', link: 'https://github.com/valentynhol/CommunityNotificationsAPI' }
    ],
    sidebar: [
      {
        items: [
          { text: 'Home', link: '/' },
          { text: 'How It Works', link: '/how-it-works' },
          { text: 'Setup Guide', link: '/setup' },
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Code Examples', link: '/code-examples' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/valentynhol/CommunityNotificationsAPI' }
    ],
    footer: {
      message: 'Released under MIT License.',
      copyright: 'Copyright © 2025-present PlutoFramework'
    }
  }
})