const scrape = require('./scrape')
const moment = require('moment')
const mongoose = require('mongoose');
const Trash = require('../models/Trash');

getDaybyName = async (name) => {
  const Name = await Trash.findOne({
    name
  });
  // if (!Name) {
  //   console.log('Could not find a trash day.');
  //   return scrape.cityTrash();
  // }
  return Name;
};

checkCurrentDay = async (date) => {
  const trashDay = moment(date).add(24, 'h');;
  const check = moment().isBefore(trashDay);
  return check;
};

formatDate = async (name, t, r) => {
  var now = moment();
  var tHr = now.diff(t, "hours");
  var rHr = now.diff(r, "hours");
  var both = tHr === rHr ? true : false;
  var tDayTill = parseFloat(tHr / 24);
  var rDayTill = parseFloat(tHr / 24);
  if (!name) {
    const trash = new Trash;
    trash.name = 'mytrashday';
    trash.trash.date = t;
    trash.recycling.date = r;
    const data = await trash.save();
    return data;
  } else {
    const data = {
      trash: {
        date: t,
        iso: moment(t).toISOString(),
        day: moment(t).format("dddd"),
        daysTill: tDayTill,
        hrsTill: tHr,
        fromNow: moment(t).calendar(null, {
          sameDay: '[is today]',
          nextDay: '[is tomorrow]',
          nextWeek: '[is] dddd',
          lastDay: '[was yesterday]',
          lastWeek: '[was last] dddd',
          sameElse: '[is on] dddd, MMMM Do'
        }),
      },
      recycling: {
        date: r,
        iso: moment(r).toISOString(),
        day: moment(r).format("dddd"),
        daysTill: rDayTill,
        hrsTill: rHr,
        fromNow: moment(r).calendar(null, {
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
      return formatDate(day.name, day.trash.date, day.recycling.date);
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
  const data = await Trash.findOneAndUpdate({ name: trashName }, { message, trash: date.trash, recycling: date.recycling }, {upsert: true, new: true  }).exec();
  return data;
}