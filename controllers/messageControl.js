const moment = require('moment-timezone');
const email = require('../handlers/email')
var checkWindow = exports.checkWindow = (day) => {
    const timeTill = day.trash.hrsTill;  
    const now = moment().tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss a z');
    if (timeTill >= -14.5 && timeTill <= -13.5) {
        return {
            title: 'normPre',
            trigger: true,
            current: now,
            tMinus: day.trash.hrsTill,
            it: day.trash.date
        };
    } else if (timeTill >= -1.5 && timeTill <= -0.5) {
        return {
            title: 'normDo',
            trigger: true,
            current: now,
            tMinus: timeTill,
            it: day.trash.date
        };
    } else if (day.trash.day != 'Friday') {
        if (
            timeTill >= -38.5 && timeTill <= -37.5) {
            return {
                title: 'altPre',
                trigger: true,
                current: now,
                tMinus: timeTill,
                it: day.trash.date
            };
        }
    } else {
        return {
            title: 'none',
            trigger: false,
            current: now,
            tMinus: timeTill,
            it: day.trash.date
        };
    }
}
// TODO: SET UP EMAIL TRANSPORT
exports.checkWindow = async (req, res) => {
    const check = await checkWindow(req.body.trashDay);
    if (check.title === 'normPre' || 'normDo') {
        await email.sendEmail(req.body.trashDay.message);
      } else if (title === 'altWarn') {
        const message = `No trash pickup on Friday! ${req.body.trashDay.message}`
        await email.sendEmail(message);
    }
    res.status(200).end();
}