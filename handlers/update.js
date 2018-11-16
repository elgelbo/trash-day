const scrape = require('./scrape')
const moment = require('moment-timezone')
const mongoose = require('mongoose');
const Trash = require('../models/Trash');

formatScrape = async (t, r) => {
    var now = moment().tz('America/Los_Angeles');
    const tDay = moment(JSON.stringify(t), "MM-DD-YYYY").tz('America/Los_Angeles').add(8, "hours");
    const rDay = moment(JSON.stringify(r), "MM-DD-YYYY").tz('America/Los_Angeles').add(8, "hours");
    var tHr = now.diff(tDay, "hours", true);
    var rHr = now.diff(rDay, "hours", true);
    var both = tHr === rHr ? true : false;
    console.log(tHr);
    console.log(rHr);
    console.log(both);
    var tDayTill = parseFloat(tHr / 24);
    var rDayTill = parseFloat(rHr / 24);
    const data = {
        trash: {
            date: tDay.format('MMMM Do YYYY, h:mm:ss a z'),
            iso: tDay.toISOString(),
            day: tDay.format("dddd"),
            daysTill: tDayTill,
            hrsTill: tHr,
            fromNow: tDay.calendar(null, {
                sameDay: '[is today]',
                nextDay: '[is tomorrow]',
                nextWeek: '[is] dddd',
                lastDay: '[was yesterday]',
                lastWeek: '[was last] dddd',
                sameElse: '[is on] dddd, MMMM Do'
            }),
        },
        recycling: {
            date: rDay.format('MMMM Do YYYY, h:mm:ss a z'),
            iso: rDay.toISOString(),
            day: rDay.format("dddd"),
            daysTill: rDayTill,
            hrsTill: rHr,
            fromNow: rDay.calendar(null, {
                sameDay: '[is today]',
                nextDay: '[is tomorrow]',
                nextWeek: '[is] dddd',
                lastDay: '[was yesterday]',
                lastWeek: '[was last] dddd',
                sameElse: '[is on] dddd, MMMM Do'
            }),
            isTrue: both
        }
    };
    // const moments = [tDay, rDay]
    return data;
}

exports.updateDate = async () => {
      const newDate = await scrape.pups();
    console.log(newDate[0], newDate[1]);
    // const t = "11/16/2018";
    // const r = "11/24/2018"
      return formatDate(JSON.stringify(newDate[0]), JSON.stringify(newDate[1]));
    // return formatScrape(t, r);
};