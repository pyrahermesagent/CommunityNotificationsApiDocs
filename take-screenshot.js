const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to page...');
    await page.goto('http://localhost:5173/CommunityNotificationsApiDocs/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    console.log('Page loaded');
    
    await page.waitForSelector('.nav-brand', { timeout: 3000 });
    console.log('Nav brand found');
    
    await page.screenshot({ 
      path: '/home/rosta/CommunityNotificationsApiDocs/screenshot-light-v3.png', 
      fullPage: false 
    });
    console.log('Light mode screenshot saved');
    
    // Check nav title
    const navTitleEl = await page.$('.nav-title');
    console.log('Nav title exists:', !!navTitleEl);
    
    // Check if there are duplicate titles
    const titleSpans = await page.$$('span[data-v-9f43907a]');
    console.log('Title spans found:', titleSpans.length);
    
    // Check hero image
    const heroImg = await page.$('img.VPImage.image-src');
    if (heroImg) {
      const src = await heroImg.getAttribute('src');
      console.log('Hero image src:', src);
    }
    
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