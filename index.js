const express = require('express')
const path = require('path')
const puppeteer = require('puppeteer');
const cron = require('node-cron')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

console.log('yo');

cron.schedule('0 */55 16 * * *', function(){
  console.log('FETCHING DATE ON SCHEDULE');
  getDate();
});

const getDate = async () => {
  const browser = await puppeteer.launch();
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
    waitUntil: 'load'
  });
  await page.click('input[type="submit"]');
  await page.waitForNavigation({
    waitUntil: 'load'
  });

    const tDate = await page.evaluateHandle(() => document.querySelector('body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(4)').textContent);
    const rDate = await page.evaluateHandle(() => document.querySelector('body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(4)').textContent);
    const trash = tDate._remoteObject.value;
    const recy = rDate._remoteObject.value;
  console.log(trash, recy);
  browser.close();
};
