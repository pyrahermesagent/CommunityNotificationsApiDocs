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
    
    // Get full computed styles for nav-title
    const navTitleInfo = await page.evaluate(() => {
      const navTitle = document.querySelector('.nav-title');
      if (!navTitle) return 'NOT FOUND';
      
      const computed = window.getComputedStyle(navTitle);
      const parent = navTitle.parentElement;
      const parentComputed = parent ? window.getComputedStyle(parent) : null;
      
      // Check parent elements too
      const parents = [];
      let p = parent;
      for (let i = 0; i < 5; i++) {
        if (!p) break;
        parents.push({
          tag: p.tagName,
          className: p.className,
          display: p.style.display || window.getComputedStyle(p).display,
          position: p.style.position || window.getComputedStyle(p).position,
          zIndex: p.style.zIndex || window.getComputedStyle(p).zIndex,
          overflow: p.style.overflow || window.getComputedStyle(p).overflow
        });
        p = p.parentElement;
      }
      
      return {
        tag: navTitle.tagName,
        className: navTitle.className,
        textContent: navTitle.textContent,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        width: computed.width,
        height: computed.height,
        fontSize: computed.fontSize,
        fontFamily: computed.fontFamily,
        fontWeight: computed.fontWeight,
        letterSpacing: computed.letterSpacing,
        textOverflow: computed.textOverflow,
        whiteSpace: computed.whiteSpace,
        overflow: computed.overflow,
        position: computed.position,
        zIndex: computed.zIndex,
        float: computed.float,
        clear: computed.clear,
        parentDisplay: parentComputed ? parentComputed.display : null,
        parentOverflow: parentComputed ? parentComputed.overflow : null,
        parentPosition: parentComputed ? parentComputed.position : null,
        parentZIndex: parentComputed ? parentComputed.zIndex : null,
        parents: parents
      };
    });
    
    console.log('Nav title full details:', JSON.stringify(navTitleInfo, null, 2));
    
    // Also check what elements are at the position of nav-title
    const elementsAtNavTitlePosition = await page.evaluate(() => {
      const navTitle = document.querySelector('.nav-title');
      if (!navTitle) return 'NOT FOUND';
      
      const rect = navTitle.getBoundingClientRect();
      const elements = document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      
      return elements.map(el => ({
        tag: el.tagName,
        className: el.className,
        style: {
          display: window.getComputedStyle(el).display,
          zIndex: window.getComputedStyle(el).zIndex,
          position: window.getComputedStyle(el).position
        }
      }));
    });
    
    console.log('Elements at nav-title position:', JSON.stringify(elementsAtNavTitlePosition, null, 2));
    
    // Save the screenshot
    await page.screenshot({ path: '/home/rosta/CommunityNotificationsApiDocs/diagnostic.png', fullPage: false });
    console.log('Screenshot saved');
    
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