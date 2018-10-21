const moment = require('moment')
const puppeteer = require('puppeteer');
const url = 'https://getitdone.force.com/ESD_TrashCollectionSchedule';

exports.cityTrash = async () => {
  const browser = await puppeteer.launch({ignoreHTTPSErrors: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  // const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true });
  console.log('i am the pup');
  try {
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'load'
    });
    const streetNumber = '#pgid\\:fmId\\:j_id44\\:j_id45\\:siteStreetNumberId';
    await page.type(streetNumber, '5023');

    const streetName = '#pgid\\:fmId\\:j_id44\\:j_id45\\:siteStreetNameId';
    await page.type(streetName, 'Collier');

    await page.click('#SearchSiteBtn');

    const btn = 'label strong a';
    await page.waitFor(btn);
    await page.click(btn);

    const nxt = '#screen_0_sitesearch > div > div > div.twelve.columns.l-margin-bl.l-padding-lm.l-padding-rm.l-padding-bm a'
    await page.waitFor(1000);
    await page.click(nxt);
    await page.waitFor(1000);

    const tDate = await page.evaluateHandle(() => document.querySelector('table.twelve > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(4)').textContent);
    const rDate = await page.evaluateHandle(() => document.querySelector('table.twelve > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(4)').textContent);
    const trashD = moment(tDate._remoteObject.value.trim(), "MM-DD-YYYY");
    const recyD = moment(rDate._remoteObject.value.trim(), "MM-DD-YYYY");
    const newR = moment(recyD).clone().add(7, "hours").toISOString();
    const newT = moment(trashD).clone().add(7, "hours").toISOString();
    await browser.close();
    return [newT, newR];
  } catch (e) {
    console.log(e);
    await browser.close();
  }
};