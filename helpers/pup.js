const puppeteer = require('puppeteer');
var moment = require('moment');
const mongoose = require('mongoose');
require('../models/Trash');
const Trash = mongoose.model('Trash');
mongoose.Promise = global.Promise;
const getDay = require('./getDay');

const url = 'https://apps.sandiego.gov/econtainer/control/searchaddressinfo';

pupDate = async (name) => {
// console.log(name);
  const browser = await puppeteer.launch({ignoreHTTPSErrors: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  // const browser = await puppeteer.launch({headless: false, ignoreHTTPSErrors: true});
  console.log('i am the pup');

  try {
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'load'
    });
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
      waitUntil: 'networkidle2',
      timeout: 3000000
    });
    await page.click('input[type="submit"]');
    await page.waitForNavigation({
      waitUntil: 'networkidle2',
      timeout: 3000000
    });
    console.log(page.url())
    const tDate = await page.evaluateHandle(() => document.querySelector('body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(4)').textContent);
    const rDate = await page.evaluateHandle(() => document.querySelector('body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(4)').textContent);
    const trashD = moment(tDate._remoteObject.value, "MM-DD-YYYY");
    const recyD = moment(rDate._remoteObject.value, "MM-DD-YYYY");
    const newR = moment(recyD).clone().add(7, "hours").toISOString();
    const newT = moment(trashD).clone().add(7, "hours").toISOString();
    console.log(newR, newT);
    browser.close();
    return getDay.processMoment(name, newT, newR);
  } catch (e) {
    console.log(e);
    browser.close();
  }
};

module.exports.pupDate = pupDate;
