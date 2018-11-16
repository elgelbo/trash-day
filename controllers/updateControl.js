const scrape = require('../handlers/scrape')
const dates = require('../handlers/dates')

scraper = async () => {
    const newDate = await scrape.pups();
    const trashDay = await dates.format(newDate[0], newDate[1]);
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
        req.body.trashDay = dbDates;
        if (current === false || current === null) {
            const theDay = await scraper();
            req.body.trashDay = theDay;
            next();
        } else {
            req.body.trashDay = dbDates;
            next();
        }
    }
}