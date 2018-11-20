const scrape = require('../handlers/scrape')
const dates = require('../handlers/dates')
const moment = require('moment-timezone');

scraper = async () => {
    const newDate = await scrape.pups();
    const converted = await dates.convert(newDate[0], newDate[1]);
    const trashDay = await dates.format(converted[0], converted[1]);  
    const message = await dates.setMessage(trashDay);  
    const dbDates = await dates.saveDay(trashDay, message);
    return dbDates;
}

exports.update = async (req, res) => {
    const theDay = await scraper();
    console.log(theDay);
    res.status(200).end();
}

exports.check = async (req, res, next) => {
    const dbDates = await dates.getDaybyName();
    if (!dbDates) {
        console.log('no data');
        const theDay = await scraper();
        req.body.trashDay = theDay;
        next();
    } else {
        const current = await dates.checkCurrentDay(dbDates.trash.iso);
        if (current === false || current === null) {
            const theDay = await scraper();
            req.body.trashDay = theDay;
            next();
        } else {
            const trashDay = await dates.format(moment(dbDates.trash.iso), moment(dbDates.recycling.iso));  
            const message = await dates.setMessage(trashDay);  
            const newDates = await dates.saveDay(trashDay, message);            
            req.body.trashDay = newDates;
            next();
        }
    }
}