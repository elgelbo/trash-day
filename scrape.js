const puppeteer = require('puppeteer');
const moment = require('moment');
const storage = require('node-persist');

const url = 'https://apps.sandiego.gov/econtainer/control/searchaddressinfo';

exports.checkDate = async (req, res, next) => {
  const now = moment();
  try {
    await storage.init().then(function() {
      storage.getItem('trash')
        .then(function(value) {
          if(!value) {
            storage.setItem('trash', now);
            req.tDate = now.toISOString();
          } else {
            req.tDate = value;
          }
        });
      storage.getItem('recycling')
        .then(function(value) {
          if(!value) {
            storage.setItem('recycling', now);
            req.rDate = now.toISOString();
          } else {
            req.rDate = value;
          }
        });
    });
    const check = now.isBefore(req.tDate);
    if (check === true) {
      console.log('The time is currently:', now.format("dddd, MMMM Do YYYY, h:mm:ss a"));
      console.log('Trash day has not happened. It is on: ', moment(req.tDate).format("dddd, MMMM Do YYYY"));
    } else {
      console.log('The time is currently:', now.format("dddd, MMMM Do YYYY, h:mm:ss a"));
      console.log('Updating trash day...');
    }
  } catch (e) {
    console.log(e);
  }
}
const getDate = async (req, res, next) => {
  const browser = await puppeteer.launch({
    headless: false
  });
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
      waitUntil: 'networkidle0'
    });
    await page.click('input[type="submit"]');
    await page.waitForNavigation({
      waitUntil: 'networkidle0'
    });
    console.log(page.url())
    const tDate = await page.evaluateHandle(() => document.querySelector('body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(4)').textContent);
    const rDate = await page.evaluateHandle(() => document.querySelector('body > table:nth-child(8) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(4)').textContent);
    const trashD = moment(tDate._remoteObject.value, "MM-DD-YYYY").toISOString();
    const recyD = moment(rDate._remoteObject.value, "MM-DD-YYYY").toISOString();
    console.log(trashD, recyD);
    await storage.init().then(function() {
      storage.setItem('trash', trashD)
        .then(function() {
          return storage.getItem('trash')
        })
        .then(function(value) {
          console.log('Trash day updated: ', value);
        });
      storage.setItem('recycling', recyD)
        .then(function() {
          return storage.getItem('recycling')
        })
        .then(function(value) {
          console.log('Recycling day updated: ', value);
        });
    });
    req.tDate = trashD;
    req.rDate = recyD;
    await browser.close();
  } catch (e) {
    console.log(e);
    browser.close();
  }
};
