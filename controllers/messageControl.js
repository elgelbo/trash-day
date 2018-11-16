const moment = require('moment-timezone');

scraper = (day) => {
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


exports.checkWindow = async (req, res, next) => {
    const check = await scraper(req.body.trashDay);
    console.log(check);
    
    // if (check.title === 'normPre' || 'normDo') {
    //     await sendEmail(day.message);
    //   } else if (title === 'altWarn') {
    //     const message = `No trash pickup on Friday! ${day.message}`
    //     await sendEmail(message);
    // }
}