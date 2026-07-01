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
    
    // Check what CSS is hiding the nav-title
    const navChecks = await page.evaluate(() => {
      const navTitle = document.querySelector('.nav-title');
      if (!navTitle) return 'NOT FOUND';
      
      const computed = window.getComputedStyle(navTitle);
      return {
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        height: computed.height,
        width: computed.width,
        fontSize: computed.fontSize,
        content: computed.content,
        textContent: navTitle.textContent,
        innerHTML: navTitle.innerHTML,
        className: navTitle.className,
        parentDisplay: computed.parentElement ? window.getComputedStyle(computed.parentElement).display : null
      };
    });
    
    console.log('Nav title computed styles:', JSON.stringify(navChecks, null, 2));
    
    // Check all styles applied to nav-title element
    const allStyleRules = await page.evaluate(() => {
      const navTitle = document.querySelector('.nav-title');
      if (!navTitle) return [];
      
      const rules = [];
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const cssRules = Array.from(sheet.cssRules || []);
          for (const rule of cssRules) {
            if (rule.selectorText && rule.selectorText.includes('.nav-title')) {
              rules.push({
                selector: rule.selectorText,
                display: rule.style.display,
                visibility: rule.style.visibility,
                opacity: rule.style.opacity,
                fontSize: rule.style.fontSize,
                order: rule.style.order
              });
            }
          }
        } catch(e) {}
      }
      return rules;
    });
    
    console.log('CSS rules for .nav-title:', JSON.stringify(allStyleRules, null, 2));
    
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