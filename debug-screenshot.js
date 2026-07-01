const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173/CommunityNotificationsApiDocs/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    await page.waitForSelector('.nav-brand', { timeout: 5000 });
    
    // Get the full nav title area HTML
    const navTitle = await page.evaluate(() => {
      const el = document.querySelector('.VPNavBarTitle');
      return el ? el.outerHTML : 'NOT FOUND';
    });
    
    console.log('=== Nav Title HTML ===');
    console.log(navTitle.substring(0, 1500));
    
    // Check custom CSS rules
    const cssRules = await page.evaluate(() => {
      const results = [];
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule.selectorText) {
              if (rule.selectorText.includes('VPNavBarTitle') || 
                  rule.selectorText.includes('nav-title') ||
                  rule.selectorText.includes('nav-brand')) {
                results.push({
                  selector: rule.selectorText,
                  display: rule.style.display,
                  overflow: rule.style.overflow,
                  textOverflow: rule.style.textOverflow
                });
              }
            }
          }
        } catch(e) {}
      }
      return results;
    });
    
    console.log('\n=== CSS Rules ===');
    console.log(JSON.stringify(cssRules, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: '/home/rosta/CommunityNotificationsApiDocs/screenshot-light-v4.png', fullPage: false });
    console.log('\nScreenshot saved');
    
    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
    await browser.close();
    process.exit(1);
  }
})().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});