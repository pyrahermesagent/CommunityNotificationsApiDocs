module.exports = {
  base: '/CommunityNotificationsApiDocs/',
  title: 'CommunityNotificationsAPI',
  description: 'Notifications REST API Template — Documentation',
  logo: '/CommunityNotificationsApiDocs/plutolabs-logo-lines.svg',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/CommunityNotificationsApiDocs/plutolabs-logo-lines.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/CommunityNotificationsApiDocs/plutolabs-logo-lines.svg' }],
    ['link', { rel: 'stylesheet', href: '/CommunityNotificationsApiDocs/custom.css' }]
  ],
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