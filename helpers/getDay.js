require('dotenv').config( { path: 'variables.env'});
const mongoose = require('mongoose');
require('../models/Trash');
const Trash = mongoose.model('Trash');
mongoose.Promise = global.Promise;
const email = require('./email');
var moment = require('moment-timezone');
var moment = require('moment');
const pup = require('./pup');

getDaybyName = async (name) => {
  const Name = await Trash.findOne({name});
  if(!Name) {
    console.log('Could not find a trash day.');
    return scrapeDay();
  }
  return Name;
};

currentDay = async (data) => {
  const now = moment();
console.log(data);
  // const trashDay = moment('2018-03-05T00:00:00.000Z');
  const trashDay = moment(data.trash.date);
  const check = moment().isBefore(trashDay);
  if (check === true) {
    console.log('Trash day has not happened');
    return processMoment(data.name, data.trash.date, data.recycling.date);
  } else {
    console.log('Trash Day has Passed. Updating information...');
    return scrapeDay(data.name);
  }
};

scrapeDay = async (name) => {
  console.log('i will use the pup to scrape.');
  const data = await pup.pupDate(name);
  return data;
};


processMoment = async (name, t, r) => {
  var now = moment();
  var tHr = now.diff(t, "hours");
  var rHr = now.diff(r, "hours");
  var both = tHr === rHr ? true : false;
  var tDayTill = parseFloat(tHr / 24);
  var rDayTill = parseFloat(tHr / 24);
  if (!name) {
    console.log('no name');
    const trash = new Trash;
    trash.name = 'mytrashday';
    trash.trash.date = t,
    trash.recycling.date = r
    const data = await trash.save();
    return data;
  } else {
    const data = await Trash.findOneAndUpdate({ name: name }, {
      'trash.date': t,
      'trash.iso': moment(t).toISOString(),
      'trash.day': moment(t).format("dddd"),
      'trash.daysTill': tDayTill,
      'trash.hrsTill': tHr,
      'trash.fromNow': moment(t).fromNow(),
      'recycling.date': r,
      'recycling.iso': moment(r).toISOString(),
      'recycling.day': moment(r).format("dddd"),
      'recycling.daysTill': rDayTill,
      'recycling.hrsTill': rHr,
      'recycling.fromNow': moment(r).fromNow(),
      'recycling.isTrue': both
    }, {new: true}).exec();
    return data;
  }
};



message = async (data) => {
  const tillTrash = data.trash.hrsTill;
  const trashDay = data.trash.day;
  if (trashDay === "Thursday") {
    console.log("Normal Trash Schedule");
    if (tillTrash > -1 && 0 > tillTrash) {
      if (data.recycling.isTrue === true) {
        const message = "Trash day is tomorrow! Don't forget recycling...";
      } else {
        const message = "Trash day is tomorrow! No recycling...";
      }
      await email.sendEmail(message);
    } else if (tillTrash < -1) {
      if (data.recycling.isTrue === true) {
        const message = `Trash day is ${
        data.trash.fromNow
      }. Don't forget the recycling!`;
        console.log(message);
        return message;
      } else {
        const message = `Trash day is ${
        data.trash.fromNow
      }. No recycling this week.`;
      }
    }
  } else {
    console.log("Holiday");
  }
};

module.exports.message = message;
module.exports.processMoment = processMoment;
module.exports.scrapeDay = scrapeDay;
module.exports.currentDay = currentDay;
module.exports.getDaybyName = getDaybyName;