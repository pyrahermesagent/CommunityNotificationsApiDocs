const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173/CommunityNotificationsApiDocs/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/home/rosta/CommunityNotificationsApiDocs/verify-light.png', fullPage: false });
    console.log('Light mode screenshot saved');
    
    // Check for the custom CSS and nav title
    const checks = await page.evaluate(() => {
      const navTitle = document.querySelector('.nav-title');
      const navBrand = document.querySelector('.nav-brand');
      const logo = document.querySelector('.nav-logo');
      
      return {
        navTitle: !!navTitle,
        navBrand: !!navBrand,
        logo: !!logo,
        logoSrc: logo ? logo.src : null,
        navTitleText: navTitle ? navTitle.textContent : null,
        customCSSLoaded: !!document.querySelector('style')
      };
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