const puppeteer = require('puppeteer');
const moment = require('moment');

const url = 'https://apps.sandiego.gov/econtainer/control/searchaddressinfo';

const getDate = async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, {
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
    await Promise.all([
      page.click('input[type="submit"]'),
      page.waitForNavigation({
        waitUntil: 'networkidle0'
      }),
    ]);
    console.log(page.url())
    await Promise.all([
      page.click('input[type="submit"]'),
      page.waitForNavigation({
        waitUntil: 'networkidle0'
      })
    ]);
    console.log(page.url())
    const tDate = await page.evaluateHandle(() => document.querySelector('body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(4)').textContent);
    const rDate = await page.evaluateHandle(() => document.querySelector('body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(4)').textContent);
    const trash = moment(tDate._remoteObject.value, "MM-DD-YYYY").toISOString();
    const recy = moment(rDate._remoteObject.value, "MM-DD-YYYY").toISOString();
    console.log(trash, recy);
    await browser.close();
  } catch (e) {
    console.log(e);
    browser.close();
  }
};
