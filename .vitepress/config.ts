import { defineConfig } from 'vitepress'
import theme from './theme/index.js'

export default defineConfig({
  title: 'CommunityNotificationsAPI',
  description: 'Notifications REST API Template — Documentation',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/how-it-works' },
      { text: 'Source Code', link: 'https://github.com/valentynhol/CommunityNotificationsAPI' }
    ],
    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Home', link: '/' },
          { text: 'How It Works', link: '/how-it-works' },
          { text: 'Setup Guide', link: '/setup' },
          { text: 'Docker Deployment', link: '/docker-deploy' },
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Code Examples', link: '/code-examples' },
          { text: 'Troubleshooting', link: '/troubleshooting' }
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