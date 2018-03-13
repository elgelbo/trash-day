const moment = require('moment');
const name = 'mytrashday';
// const url = 'https://apps.sandiego.gov/econtainer/control/searchaddressinfo';
const getDay = require('./getDay');

exports.checkDate = async (req, res, next) => {
  const db = await getDay.getDaybyName(name);
  const current = await getDay.currentDay(db);
  req.body.data = current;
  next();
};
