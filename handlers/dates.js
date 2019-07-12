const moment = require('moment');
const mongoose = require('mongoose');
const Trash = require('../models/Trash');
const now = moment();

exports.convert = async (t, r) => {
	const tDay = moment(t, "MM-DD-YYYY").add(8, "hours");
	const rDay = moment(r, "MM-DD-YYYY").add(8, "hours");
	return [tDay, rDay];
}

const getFri = (it) => {
	const theEnd = now.clone().endOf('month');
	while (theEnd.day() !== 5) {
		theEnd.subtract(1, 'day');
	}
	if (it.dayOfYear() === theEnd) {
		return theEnd.dayOfYear();
	} else if (theEnd.clone().subtract(1, 'w').dayOfYear()){
		return theEnd.clone().subtract(1, 'w').dayOfYear();
	}
}

exports.format = async (t, r) => {
	const tDay = t;
	const rDay = r;
	const lastFri = getFri(rDay.clone());
	var payVictor = lastFri === tDay.dayOfYear() ? true : false;
	var tHr = moment().diff(tDay, "hours", true);
	var rHr = moment().diff(rDay, "hours", true);
	var both = tHr === rHr ? true : false;
	var holiday = tDay.day() != 5 ? true : false;
	var tDayTill = parseFloat(tHr / 24);
	var rDayTill = parseFloat(rHr / 24);
	const data = {
		payVictor,
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
		message += `No recycling this week.`
	}
	if (trashDay.payVictor === true) {
		message += ` Pay Victor this week!`;
	}
	return message;
}

exports.saveDay = async (date, message, lastScrape) => {
	const update = moment().format('MMMM Do YYYY, h:mm:ss a');
	if (lastScrape === true) {
		const data = await Trash.findOneAndUpdate({ name: 'mytrashday' }, { update, scrape: update, message, holiday: date.holiday, payVictor: date.payVictor, trash: date.trash, recycling: date.recycling }, { upsert: true, new: true }).exec();
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
	const check = moment().isBefore(newDay);
	return check;
};