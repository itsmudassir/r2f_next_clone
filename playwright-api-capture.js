// Script to capture RIGHT2FIXAPPS.COM API calls with Playwright

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Track all API calls to right2fixapps.com
  const apiCalls = [];

  // Intercept all requests
  page.on('request', request => {
    const url = request.url();
    if (url.includes('right2fixapps.com')) {
      const method = request.method();
      const headers = request.headers();
      const postData = request.postData();
      
      apiCalls.push({
        url,
        method,
        headers,
        postData,
        timestamp: new Date().toISOString()
      });
      
      console.log('\n=== API CALL CAPTURED ===');
      console.log('URL:', url);
      console.log('Method:', method);
      if (postData) {
        console.log('Body:', postData);
      }
    }
  });

  // Navigate to RIGHT2FIX
  await page.goto('https://right2fix.com');
  
  console.log('\n1. Initial page load APIs captured');
  
  // Wait for page to load
  await page.waitForTimeout(2000);
  
  // Test search autocomplete
  console.log('\n2. Testing search autocomplete...');
  await page.fill('input[placeholder="Search"]', 'brake pads');
  await page.waitForTimeout(1000);
  
  // Click filter button
  console.log('\n3. Clicking filter button...');
  try {
    await page.click('text=Filter');
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log('Filter button not found');
  }
  
  // Try different filter options
  console.log('\n4. Testing filter options...');
  
  // Click on Brands
  try {
    await page.click('text=Brands');
    await page.waitForTimeout(1000);
  } catch (e) {}
  
  // Click on Categories
  try {
    await page.click('text=Categories');
    await page.waitForTimeout(1000);
  } catch (e) {}
  
  // Type in search with enter
  console.log('\n5. Testing search with enter...');
  await page.fill('input[placeholder="Search"]', 'oil filter');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  
  // Print all captured API calls
  console.log('\n\n=== ALL CAPTURED RIGHT2FIXAPPS.COM API CALLS ===\n');
  apiCalls.forEach((call, index) => {
    console.log(`${index + 1}. ${call.method} ${call.url}`);
    const url = new URL(call.url);
    console.log('   Parameters:', url.search);
    if (call.postData) {
      console.log('   Body:', call.postData);
    }
    console.log('');
  });
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync('captured-api-calls.json', JSON.stringify(apiCalls, null, 2));
  console.log('API calls saved to captured-api-calls.json');
  
  // Keep browser open for manual testing
  console.log('\nBrowser will stay open for manual testing. Press Ctrl+C to exit.');
})();