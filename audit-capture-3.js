const { chromium } = require('playwright')
const fs = require('fs')
const { spawn } = require('child_process')
const http = require('http')

;(async () => {
  await fs.promises.mkdir('/tmp/audit3', { recursive: true })
  
  // Start test server
  const server = spawn('node', ['test-server.js'], { stdio: ['pipe', 'pipe', 'pipe'] })
  await new Promise(r => setTimeout(r, 2000))
  
  // Verify server is running
  const serverOk = await new Promise(resolve => {
    http.get('http://127.0.0.1:8765/', res => resolve(res.statusCode === 200)).on('error', () => resolve(false))
  })
  
  if (!serverOk) {
    server.kill()
    await new Promise(r => setTimeout(r, 1000))
    server.spawn('node', ['test-server.js'], { stdio: ['pipe', 'pipe', 'pipe'] })
    await new Promise(r => setTimeout(r, 2000))
  }
  
  const browser = await chromium.launch()
  const base = 'http://127.0.0.1:8765/CommunityNotificationsApiDocs'

  const pages = [
    { name: 'index', path: '/index.html' },
    { name: 'setup', path: '/setup.html' },
    { name: 'api-reference', path: '/api-reference.html' },
    { name: 'code-examples', path: '/code-examples.html' },
    { name: 'how-it-works', path: '/how-it-works.html' },
    { name: 'docker-deploy', path: '/docker-deploy.html' },
    { name: 'troubleshooting', path: '/troubleshooting.html' },
  ]

  const viewports = [
    { name: 'Desktop_1920', w: 1920, h: 1080 },
    { name: 'Mobile_iPhone_SE', w: 375, h: 667 },
    { name: 'Mobile_Pixel_7', w: 412, h: 915 },
    { name: 'Tablet_iPad', w: 820, h: 1180 },
  ]

  const results = []

  for (const p of pages) {
    for (const vp of viewports) {
      const pg = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
      try {
        await pg.goto(base + p.path, { waitUntil: 'networkidle' })
        await new Promise(r => setTimeout(r, 1500))
        const outFile = `/tmp/audit3/${p.name}_${vp.name}.png`
        await pg.screenshot({ path: outFile, fullPage: false })
        results.push({ page: p.name, vp: vp.name, status: 'OK' })
      } catch (e) {
        results.push({ page: p.name, vp: vp.name, status: 'FAIL', error: e.message })
      }
      await pg.close()
    }
  }

  await browser.close()
  server.kill()
  console.log(JSON.stringify(results, null, 2))
  console.log(`\nTotal: ${results.length}, OK: ${results.filter(r => r.status === 'OK').length}`)
})()