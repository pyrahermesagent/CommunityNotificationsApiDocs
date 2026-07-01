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
    
    // Check nav-title and hero text
    const checks = await page.evaluate(() => {
      const navTitle = document.querySelector('.nav-title');
      const headingText = document.querySelector('.VPHero .heading .text');
      const navBrand = document.querySelector('.nav-brand');
      
      return {
        navTitleExists: !!navTitle,
        navTitleText: navTitle ? navTitle.textContent : null,
        navTitleDisplay: navTitle ? window.getComputedStyle(navTitle).display : null,
        navTitleHeight: navTitle ? window.getComputedStyle(navTitle).height : null,
        navTitleWidth: navTitle ? window.getComputedStyle(navTitle).width : null,
        navTitleVisible: navTitle ? window.getComputedStyle(navTitle).visibility : null,
        navTitleOpacity: navTitle ? window.getComputedStyle(navTitle).opacity : null,
        navTitleOverflow: navTitle ? window.getComputedStyle(navTitle).overflow : null,
        navTitleWhiteSpace: navTitle ? window.getComputedStyle(navTitle).whiteSpace : null,
        navBrandExists: !!navBrand,
        navBrandDisplay: navBrand ? window.getComputedStyle(navBrand).display : null,
        navBrandChildren: navBrand ? Array.from(navBrand.children).map(c => ({
          tag: c.tagName,
          class: c.className,
          text: c.textContent
        })) : null,
        headingTextExists: !!headingText,
        headingTextDisplay: headingText ? window.getComputedStyle(headingText).display : null,
        headingTextVisibility: headingText ? window.getComputedStyle(headingText).visibility : null,
        headingTextOverflow: headingText ? window.getComputedStyle(headingText).overflow : null
      };
    });
    
    console.log('Nav title and hero text checks:', JSON.stringify(checks, null, 2));
    
    // Check all CSS rules that might affect nav-title
    const cssRules = await page.evaluate(() => {
      const results = [];
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const cssRules = Array.from(sheet.cssRules || []);
          for (const rule of cssRules) {
            if (rule.selectorText && (rule.selectorText.includes('.nav-title') || 
                                       rule.selectorText.includes('nav-brand'))) {
              results.push({
                sheet: sheet.href || 'unknown',
                selector: rule.selectorText,
                display: rule.style.display,
                overflow: rule.style.overflow,
                visibility: rule.style.visibility,
                opacity: rule.style.opacity,
                whiteSpace: rule.style.whiteSpace,
                zIndex: rule.style.zIndex,
                position: rule.style.position,
                maxWidth: rule.style.maxWidth,
                minWidth: rule.style.minWidth,
                width: rule.style.width,
                height: rule.style.height
              });
            }
          }
        } catch(e) {}
      }
      return results;
    });
    
    console.log('CSS rules for nav-title:', JSON.stringify(cssRules, null, 2));
    
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