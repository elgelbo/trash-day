const puppeteer = require('puppeteer');
const url = 'https://getitdone.force.com/ESD_TrashCollectionSchedule';

exports.pups = async () => {
  // for heroku prod
  const browser = await puppeteer.launch({ignoreHTTPSErrors: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  // for testing/observing local
  // const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true });
  console.log('i am the pup');
  try {
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'load'
    });
    const streetNumber = '#pgid\\:fmId\\:j_id47\\:j_id48\\:siteStreetNumberId';
    await page.type(streetNumber, '5023');

    const streetName = '#pgid\\:fmId\\:j_id47\\:j_id48\\:siteStreetNameId';
    await page.type(streetName, 'Collier');

    await page.click('#SearchSiteBtn');

    const btn = '#pgid\\:fmId\\:j_id47\\:j_id48\\:j_id65 > div > a';    
    await page.waitFor(btn);
    await page.click(btn);

    const nxt = '#pgid\\:fmId\\:ActSubmit1'
    
    await page.waitFor(1000);
    await page.click(nxt);
    await page.waitFor(1000);

    const tDate = await page.evaluateHandle(() => document.querySelector('table.twelve > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(4)').textContent);
    const rDate = await page.evaluateHandle(() => document.querySelector('table.twelve > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(4)').textContent);
    const trashD = tDate._remoteObject.value.trim();
    const recyD = rDate._remoteObject.value.trim();
    await browser.close();
    return [trashD, recyD];
  } catch (e) {
    console.log(e);
    await browser.close();
  }
};