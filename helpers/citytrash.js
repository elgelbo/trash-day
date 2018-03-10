const puppeteer = require('puppeteer');

exports.getTrash = () => {
  console.log('got the trash');
};


exports.getDate = async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('https://apps.sandiego.gov/econtainer/control/searchaddressinfo', {
    waitUntil: 'load'
  });
  console.log(page.url());

  await page.click('#stnumber');
  await page.keyboard.type('4516');

  await page.click('#stname');
  await page.keyboard.type('UTAH');

  await page.select('#stsuffix', 'ST')

  await page.click('#stunit');
  await page.keyboard.type('4');

  await page.click('#stzip');
  await page.keyboard.type('92116');

  await page.click('input[type="submit"]');

  await page.waitForNavigation({
    waitUntil: 'load',
    timeout: 3000000
  });
  await page.click('input[type="submit"]');
  await page.waitForNavigation({
    waitUntil: 'load',
    timeout: 3000000
  });

  const tDate = await page.evaluateHandle(() => document.querySelector('body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(4)').textContent);
  const rDate = await page.evaluateHandle(() => document.querySelector('body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(4)').textContent);
  const trash = tDate._remoteObject.value;
  const recy = rDate._remoteObject.value;
  console.log(trash, recy);
  browser.close();
};
