const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173/CommunityNotificationsApiDocs/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    await page.waitForTimeout(3000);
    
    // Light mode screenshot
    await page.screenshot({ path: '/home/rosta/CommunityNotificationsApiDocs/final-light.png', fullPage: false });
    console.log('Light mode screenshot saved');
    
    // Switch to dark mode
    await page.click('[aria-label="Switch to dark theme"]');
    await page.waitForTimeout(1000);
    
    // Dark mode screenshot
    await page.screenshot({ path: '/home/rosta/CommunityNotificationsApiDocs/final-dark.png', fullPage: false });
    console.log('Dark mode screenshot saved');
    
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