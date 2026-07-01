const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Check what the logo src is and if it's loading
    const logoChecks = await page.evaluate(() => {
      const logos = document.querySelectorAll('.nav-logo');
      const results = [];
      for (const logo of logos) {
        results.push({
          src: logo.src,
          complete: logo.complete,
          naturalWidth: logo.naturalWidth,
          naturalHeight: logo.naturalHeight,
          alt: logo.alt
        });
      }
      return results;
    });
    
    console.log('Logo checks:', JSON.stringify(logoChecks, null, 2));
    
    // Try to load the logo directly
    try {
      const response = await page.goto('http://localhost:5173/logo-lines-rounded-black.svg', { 
        waitUntil: 'networkidle',
        timeout: 5000 
      });
      console.log('Logo response status:', response.status());
      console.log('Logo response contentType:', response.headers()['content-type']);
    } catch (err) {
      console.log('Logo direct load failed:', err.message);
    }
    
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