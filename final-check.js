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
    await page.screenshot({ path: '/home/rosta/CommunityNotificationsApiDocs/final-check.png', fullPage: false });
    console.log('Screenshot saved');
    
    const checks = await page.evaluate(() => {
      const navTitle = document.querySelector('.nav-title');
      const navBrand = document.querySelector('.nav-brand');
      const logo = document.querySelector('.nav-logo');
      
      if (navTitle) {
        const computed = window.getComputedStyle(navTitle);
        return {
          navTitle: !!navTitle,
          navBrand: !!navBrand,
          logo: !!logo,
          navTitleText: navTitle.textContent,
          navTitleDisplay: computed.display,
          navTitleHeight: computed.height,
          navTitleWidth: computed.width,
          navTitleVisibility: computed.visibility,
          navTitleOpacity: computed.opacity,
          navTitleFontSize: computed.fontSize
        };
      }
      return { navTitle: false };
    });
    
    console.log('Checks:', JSON.stringify(checks, null, 2));
    await browser.close();
  } catch (err) {
    console.error('Error:', err.message);
    await browser.close();
    process.exit(1);
  }
})().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});