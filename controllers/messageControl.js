const moment = require('moment-timezone');
const email = require('../handlers/email')

altTill = (now) => {
    if (now.day() <= 5) {
        const nextT = now.clone().milliseconds(0).seconds(0).minutes(0).hours(8).day(5);
        return now.diff(nextT, "hours", true);
    } else {
        const nextT = now.clone().milliseconds(0).seconds(0).minutes(0).hours(8).day(5).add(1, 'weeks');
        return now.diff(nextT, "hours", true);
    }
}

var check = exports.check = (day) => {
    const timeTill = day.trash.hrsTill;
    const now = moment().tz('America/Los_Angeles');
    if (timeTill >= -14.5 && timeTill <= -13.5) {
        return {
            title: 'normPre',
            trigger: true,
            current: now.format('MMMM Do YYYY, h:mm:ss a z'),
            tMinus: timeTill,
            it: day.trash.date
        };
    } else if (timeTill >= -1.5 && timeTill <= -0.5) {
        return {
            title: 'normDo',
            trigger: true,
            current: now.format('MMMM Do YYYY, h:mm:ss a z'),
            tMinus: timeTill,
            it: day.trash.date
        };
    } else if (day.holiday === true) {
        const alty = altTill(now);
        if (now.day() === 4 && alty >= -14.5 && alty <= -13.5) {
            return {
                title: 'altWarn',
                trigger: true,
                current: now.format('MMMM Do YYYY, h:mm:ss a z'),
                tMinus: timeTill,
                it: day.trash.date
            };
        } else if (now.day() === 5 && alty >= -1.5 && alty <= -0.5) {
            return {
                title: 'altWarnDay',
                trigger: true,
                current: now.format('MMMM Do YYYY, h:mm:ss a z'),
                tMinus: timeTill,
                it: day.trash.date
            };
        } else {
            return {
                title: 'none',
                trigger: false,
                current: now.format('MMMM Do YYYY, h:mm:ss a z'),
                tMinus: timeTill,
                it: day.trash.date
            };
        }
    } else {
        return {
            title: 'none',
            trigger: false,
            current: now.format('MMMM Do YYYY, h:mm:ss a z'),
            tMinus: timeTill,
            it: day.trash.date
        };
    }
}
// TODO: SET UP EMAIL TRANSPORT
exports.checkWindow = async (req, res) => {
    const checked = await check(req.body.trashDay);
    console.log(checked);
    if (checked.title === 'normPre' || checked.title === 'normDo') {
        await email.sendEmail(req.body.trashDay.message);
    } 
    else if (checked.title === 'altWarn') {
        const message = `No trash pickup on Friday! ${req.body.trashDay.message}`
        await email.sendEmail(message);
    }
     else if (checked.title === 'altWarnDay') {
        const message = `No trash pickup today! ${req.body.trashDay.message}`
        await email.sendEmail(message);
    }
    res.status(200).end();
}

exports.testEmail = async (req, res) => {
    const checked = await check(req.body.trashDay);
    const message = `TEST! ${req.body.trashDay.message}`
    await email.sendEmail(message);
    res.status(200).end();
}