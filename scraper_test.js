const puppeteer = require('puppeteer');
var moment = require('moment');
const mongoose = require('mongoose');
require('./models/Trash');
const Trash = mongoose.model('Trash');
mongoose.Promise = global.Promise;
const getDay = require('./helpers/getDay');

const url = 'https://getitdone.force.com/ESD_TrashCollectionSchedule';

pupDate = async () => {
  // console.log(name);
  // const browser = await puppeteer.launch({ignoreHTTPSErrors: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const browser = await puppeteer.launch({headless: false, ignoreHTTPSErrors: true});
  try {
    console.log('i am the pup');
    const page = await browser.newPage();
    await page.goto(url);

    const streetNumber = '#pgid\\:fmId\\:j_id44\\:j_id45\\:siteStreetNumberId';
    await page.type(streetNumber, '5023');

    const streetName = '#pgid\\:fmId\\:j_id44\\:j_id45\\:siteStreetNameId';
    await page.type(streetName, 'Collier');

    await page.click('#SearchSiteBtn');
    // await page.waitFor(100);
    // console.log('ooofy dooofy');
    const btn = 'label strong a';
    await page.waitFor(btn);
    await page.click(btn);

    const nxt = '#screen_0_sitesearch > div > div > div.twelve.columns.l-margin-bl.l-padding-lm.l-padding-rm.l-padding-bm a'
    await page.waitFor(1000);
    await page.click(nxt);
    await page.waitFor(1000);
    const tDate = await page.evaluateHandle(() => document.querySelector('table.twelve > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(4)').textContent);
    console.log(tDate._remoteObject.value.trim());
    

    await browser.close();
  } catch (e) {
    console.log(e);
    await browser.close();
  }
};

pupDate();