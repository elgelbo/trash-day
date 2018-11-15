const scrape = require('./scrape')
const moment = require('moment-timezone')
const mongoose = require('mongoose');
const Trash = require('../models/Trash');

getDaybyName = async (name) => {
  const Name = await Trash.findOne({
    name
  });
  return Name;
};

checkCurrentDay = async (date) => {
  const trashDay = moment(date).add(24, 'h');;
  const check = moment().isBefore(trashDay);
  return check;
};

formatDate = async (name, t, r) => {
  var now = moment().tz('America/Los_Angeles');
  const tDay = moment(t).tz('America/Los_Angeles');
  const rDay = moment(r).tz('America/Los_Angeles');
  var tHr = now.diff(tDay, "hours", true);
  var rHr = now.diff(rDay, "hours", true);
  console.log(tHr);
  var both = tHr === rHr ? true : false;
  var tDayTill = parseFloat(tHr / 24);
  var rDayTill = parseFloat(rHr / 24);
  if (!name) {
    const trash = new Trash;
    trash.name = 'mytrashday';
    trash.trash.date = tDay;
    trash.recycling.date = rDay;
    const data = await trash.save();
    return data;
  } else {
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
    return data;
  }

}

const trashName = 'mytrashday';

exports.checkDate = async () => {
  const day = await getDaybyName(trashName);
  if (day === null) {
    const newDate = await scrape.cityTrash();
    return formatDate(trashName, newDate[0], newDate[1]);
  } else {
    const current = await checkCurrentDay(day.trash.iso);
    if (current === false || current === null) {
      const newDate = await scrape.cityTrash();
      return formatDate(trashName, newDate[0], newDate[1]);
    } else {
      return formatDate(day.name, day.trash.iso, day.recycling.iso);
    }
  }
};

exports.setMessage = (trashDay) => {
  if (trashDay.recycling.isTrue === true) {
    return `Trash day ${trashDay.trash.fromNow}. Don't forget the recycling!`
  } else {
    return `Trash day ${trashDay.trash.fromNow}. No recycling this week. The next recycling day ${trashDay.recycling.fromNow}.`
  }
}

exports.saveDay = async (date, message) => {
  const data = await Trash.findOneAndUpdate({ name: trashName }, { message, trash: date.trash, recycling: date.recycling }, { upsert: true, new: true }).exec();
  return data;
}