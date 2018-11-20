const moment = require('moment-timezone');
const mongoose = require('mongoose');
const Trash = require('../models/Trash');
var now = moment().tz('America/Los_Angeles');

exports.convert = async (t, r) => {
    const tDay = moment(t, "MM-DD-YYYY").tz('America/Los_Angeles').add(8, "hours");
    const rDay = moment(r, "MM-DD-YYYY").tz('America/Los_Angeles').add(8, "hours");
    return [tDay, rDay];
}

exports.format = async (t, r) => {
    const tDay = t;
    const rDay = r;
    var tHr = now.diff(tDay, "hours", true);
    var rHr = now.diff(rDay, "hours", true);
    var both = tHr === rHr ? true : false;
    var holiday = tDay.day() != 5 ? true : false;
    console.log('Time Till Trash Day: ' + tHr);
    console.log('Recyling Day: ' + both);
    console.log('Holiday Schedule: ' + holiday);
    var tDayTill = parseFloat(tHr / 24);
    var rDayTill = parseFloat(rHr / 24);
    const data = {
        holiday,
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
    return data;
}

exports.setMessage = (trashDay) => {
    var message = '';
    message += `Trash day ${trashDay.trash.fromNow}. `
    if (trashDay.recycling.isTrue === true) {
        message += `Don't forget the recycling!`
    } else {
        message += `No recycling this week. The next recycling day ${trashDay.recycling.fromNow}.`
    }
    return message;
}

exports.saveDay = async (date, message, lastScrape) => {
    const update = now.format('MMMM Do YYYY, h:mm:ss a z');
    if (lastScrape === true) {
        const data = await Trash.findOneAndUpdate({ name: 'mytrashday' }, { update, scrape: update, message, holiday: date.holiday, trash: date.trash, recycling: date.recycling }, { upsert: true, new: true }).exec();
        return data;
    } else {
        const data = await Trash.findOneAndUpdate({ name: 'mytrashday' }, { update, message, holiday: date.holiday, trash: date.trash, recycling: date.recycling }, { upsert: true, new: true }).exec();
        return data;
    }
}

exports.getDaybyName = async (name) => {
    const Name = await Trash.findOne({
        name: 'mytrashday'
    });
    return Name;
};

exports.checkCurrentDay = async (date) => {
    const newDay = moment(date).add(36, 'h');;
    const check = moment().tz('America/Los_Angeles').isBefore(newDay);
    return check;
};