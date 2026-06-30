const fs = require('fs')
const path = require('path')

const cssPath = path.join(__dirname, 'styles', 'custom.css')
const customCSS = fs.readFileSync(cssPath, 'utf8')

module.exports = {
  base: '/CommunityNotificationsApiDocs/',
  title: 'CommunityNotificationsAPI',
  description: 'Notifications REST API Template — Documentation',
  logo: '/plutolabs-logo-lines.svg',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/plutolabs-logo-lines.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/plutolabs-logo-lines.svg' }],
    ['style', {}, `<style>
      .VPNavBarTitle img {
        height: 28px !important;
        width: auto !important;
        object-fit: contain !important;
        margin-right: 8px !important;
      }
    </style>`]
  ],
  vite: {
    css: {
      preprocessorOptions: {
        css: {
          additionalData: customCSS
        }
      }
    }
  },
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
}