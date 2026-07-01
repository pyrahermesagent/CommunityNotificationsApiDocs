const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5176/CommunityNotificationsApiDocs/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    await page.waitForTimeout(3000);
    
    // Check nav branding and header overflow
    const navChecks = await page.evaluate(() => {
      const navBrand = document.querySelector('.nav-brand');
      const navTitle = document.querySelector('.nav-title');
      const vpTitle = document.querySelector('.VPNavBarTitle .title');
      
      return {
        navBrandExists: !!navBrand,
        navTitleExists: !!navTitle,
        navTitleText: navTitle ? navTitle.textContent : null,
        navTitleDisplay: navTitle ? window.getComputedStyle(navTitle).display : null,
        navTitleOverflow: navTitle ? window.getComputedStyle(navTitle).overflow : null,
        navTitleWhiteSpace: navTitle ? window.getComputedStyle(navTitle).whiteSpace : null,
        vpTitleOverflow: vpTitle ? window.getComputedStyle(vpTitle).overflow : null,
        vpTitleText: vpTitle ? (vpTitle.querySelector('a')?.textContent || vpTitle.textContent) : null
      };
    });
    
    console.log('Nav checks:', JSON.stringify(navChecks, null, 2));
    
    // Check hero centering
    const heroChecks = await page.evaluate(() => {
      const main = document.querySelector('.VPHero .main');
      const actions = document.querySelector('.VPHero .actions');
      
      return {
        mainDisplay: main ? window.getComputedStyle(main).display : null,
        mainJustifyContent: main ? window.getComputedStyle(main).justifyContent : null,
        mainAlignItems: main ? window.getComputedStyle(main).alignItems : null,
        actionsDisplay: actions ? window.getComputedStyle(actions).display : null,
        actionsJustifyContent: actions ? window.getComputedStyle(actions).justifyContent : null
      };
    });
    
    console.log('Hero checks:', JSON.stringify(heroChecks, null, 2));
    
    // Check feature cards
    const featureChecks = await page.evaluate(() => {
      const container = document.querySelector('.VPHomeFeatures .container');
      const vpFeature = document.querySelector('.VPFeature');
      
      return {
        containerExists: !!container,
        containerDisplay: container ? window.getComputedStyle(container).display : null,
        containerJustifyContent: container ? window.getComputedStyle(container).justifyContent : null,
        containerAlignItems: container ? window.getComputedStyle(container).alignItems : null
      };
    });
    
    console.log('Feature checks:', JSON.stringify(featureChecks, null, 2));
    
    // Check theme-aware logo
    const logoCheck = await page.evaluate(() => {
      const logo = document.querySelector('.nav-logo');
      return {
        src: logo?.src,
        complete: logo?.complete,
        naturalWidth: logo?.naturalWidth,
        naturalHeight: logo?.naturalHeight
      };
    });
    
    console.log('Logo check:', JSON.stringify(logoCheck, null, 2));
    
    // Check if dark mode toggle exists
    const darkModeCheck = await page.evaluate(() => {
      const toggle = document.querySelector('[aria-label="Switch to dark theme"]') || document.querySelector('.VPSwitch');
      return {
        toggleExists: !!toggle,
        toggleText: toggle?.textContent,
        toggleClass: toggle?.className
      };
    });
    
    console.log('Dark mode check:', JSON.stringify(darkModeCheck, null, 2));
    
    // Save screenshot
    await page.screenshot({ path: '/home/rosta/CommunityNotificationsApiDocs/verify-home.png', fullPage: false });
    console.log('Screenshot saved');
    
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