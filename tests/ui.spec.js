const { test, expect } = require('@playwright/test')

// Use HTTP server instead of file:// to avoid CORS issues
const BASE_URL = 'http://127.0.0.1:8765'

// Desktop viewports
const DESKTOP_VIEWPORTS = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 }
]

// Mobile viewports
const MOBILE_VIEWPORTS = [
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Pixel 7', width: 412, height: 915 }
]

// Tablet viewport
const TABLET_VIEWPORT = { name: 'iPad Air', width: 820, height: 1180 }

// All pages to test
const PAGES = [
  { name: 'Home', path: '/index.html' },
  { name: 'How It Works', path: '/how-it-works.html' },
  { name: 'Setup Guide', path: '/setup.html' },
  { name: 'Docker Deployment', path: '/docker-deploy.html' },
  { name: 'API Reference', path: '/api-reference.html' },
  { name: 'Code Examples', path: '/code-examples.html' },
  { name: 'Troubleshooting', path: '/troubleshooting.html' },
  { name: '404', path: '/404.html' }
]

// Test each page on different viewports
PAGES.forEach(page => {
  test.describe(`${page.name} Page`, () => {
    // Desktop tests
    DESKTOP_VIEWPORTS.forEach(vp => {
      test.describe(`Desktop ${vp.name}`, () => {
        test('screenshot baseline test', async ({ page: playwrightPage }) => {
          await playwrightPage.setViewportSize({ width: vp.width, height: vp.height })
          await playwrightPage.goto(BASE_URL + page.path)
          await playwrightPage.waitForLoadState('networkidle')
          await playwrightPage.waitForTimeout(1000)
          
          // Check for common visual bugs
          // 1. Check no horizontal overflow
          const scrollWidth = await playwrightPage.evaluate(() => document.body.scrollWidth)
          const clientWidth = await playwrightPage.evaluate(() => document.body.clientWidth)
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // Allow 1px for rounding

          // 2. Check all images are loaded
          const unloadedImages = await playwrightPage.evaluate(() => {
            return Array.from(document.querySelectorAll('img')).filter(img => !img.complete).length
          })
          expect(unloadedImages).toBe(0)

          // 3. Check no text overflow issues (elements with ellipsis that shouldn't)
          // Just verify content is rendered
          const hasContent = await playwrightPage.evaluate(() => document.body.textContent.length > 0)
          expect(hasContent).toBe(true)

          // Take screenshot
          await playwrightPage.screenshot({ 
            path: `test-results/screenshots/${page.name.replace(/\s+/g, '_')}_${vp.name.replace(/\s+/g, '_')}.png`,
            fullPage: true
          })
        })

        test('no console errors', async ({ page: playwrightPage, context }) => {
          await playwrightPage.setViewportSize({ width: vp.width, height: vp.height })
          const consoleErrors = []
          context.on('console', msg => {
            if (msg.type() === 'error') {
              consoleErrors.push(msg.text())
            }
          })
          
          await playwrightPage.goto(BASE_URL + page.path)
          await playwrightPage.waitForLoadState('networkidle')
          await playwrightPage.waitForTimeout(500)
          
          // Filter out known warnings that aren't actual errors
          const significantErrors = consoleErrors.filter(error => 
            !error.includes('Hydration completed but contains mismatches') &&
            !error.includes('Access to font') &&
            !error.includes('Access to script')
          )
          
          expect(significantErrors).toEqual([])
        })

        test('no 404 resources', async ({ page: playwrightPage, context }) => {
          await playwrightPage.setViewportSize({ width: vp.width, height: vp.height })
          const responses = []
          context.on('response', async response => {
            if (response.status() === 404) {
              responses.push(response.url())
            }
          })
          
          await playwrightPage.goto(BASE_URL + page.path)
          await playwrightPage.waitForLoadState('networkidle')
          await playwrightPage.waitForTimeout(500)
          
          expect(responses).toEqual([])
        })
      })
    })

    // Mobile tests
    MOBILE_VIEWPORTS.forEach(vp => {
      test.describe(`Mobile ${vp.name}`, () => {
        test('screenshot baseline test', async ({ page: playwrightPage }) => {
          await playwrightPage.setViewportSize({ width: vp.width, height: vp.height })
          await playwrightPage.goto(BASE_URL + page.path)
          await playwrightPage.waitForLoadState('networkidle')
          await playwrightPage.waitForTimeout(1000)
          
          // Check for common visual bugs
          const hasContent = await playwrightPage.evaluate(() => document.body.textContent.length > 0)
          expect(hasContent).toBe(true)

          // 2. Check all images are loaded
          const unloadedImages = await playwrightPage.evaluate(() => {
            return Array.from(document.querySelectorAll('img')).filter(img => !img.complete).length
          })
          expect(unloadedImages).toBe(0)

          // Take screenshot
          await playwrightPage.screenshot({ 
            path: `test-results/screenshots/${page.name.replace(/\s+/g, '_')}_${vp.name.replace(/\s+/g, '_')}.png`,
            fullPage: true
          })
        })

        test('no console errors', async ({ page: playwrightPage, context }) => {
          await playwrightPage.setViewportSize({ width: vp.width, height: vp.height })
          const consoleErrors = []
          context.on('console', msg => {
            if (msg.type() === 'error') {
              consoleErrors.push(msg.text())
            }
          })
          
          await playwrightPage.goto(BASE_URL + page.path)
          await playwrightPage.waitForLoadState('networkidle')
          await playwrightPage.waitForTimeout(500)
          
          // Filter out known warnings that aren't actual errors
          const significantErrors = consoleErrors.filter(error => 
            !error.includes('Hydration completed but contains mismatches') &&
            !error.includes('Access to font') &&
            !error.includes('Access to script')
          )
          
          expect(significantErrors).toEqual([])
        })
      })
    })

    // Tablet test
    test.describe(`Tablet ${TABLET_VIEWPORT.name}`, () => {
      test('screenshot baseline test', async ({ page: playwrightPage }) => {
        await playwrightPage.setViewportSize({ 
          width: TABLET_VIEWPORT.width, 
          height: TABLET_VIEWPORT.height 
        })
        await playwrightPage.goto(BASE_URL + page.path)
        await playwrightPage.waitForLoadState('networkidle')
        await playwrightPage.waitForTimeout(1000)
        
        const hasContent = await playwrightPage.evaluate(() => document.body.textContent.length > 0)
        expect(hasContent).toBe(true)

        const unloadedImages = await playwrightPage.evaluate(() => {
          return Array.from(document.querySelectorAll('img')).filter(img => !img.complete).length
        })
        expect(unloadedImages).toBe(0)
        
        await playwrightPage.screenshot({ 
          path: `test-results/screenshots/${page.name.replace(/\s+/g, '_')}_${TABLET_VIEWPORT.name.replace(/\s+/g, '_')}.png`,
          fullPage: true
        })
      })
    })
  })
})

// Test common elements across pages
test.describe('Common Elements', () => {
  test('navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(BASE_URL + '/index.html')
    
    // Test navigation links
    await page.getByRole('link', { name: 'Docs' }).click()
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('how-it-works.html')
  })

  test('footer is present', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(BASE_URL + '/index.html')
    
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('logo is present in header', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(BASE_URL + '/index.html')
    
    const logo = page.locator('img[alt="PlutoFramework"]')
    await expect(logo).toBeVisible()
  })

  test('logo is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(BASE_URL + '/index.html')
    
    const logo = page.locator('img[alt="PlutoFramework"]')
    await expect(logo).toBeVisible()
  })
})