const cityTrash = require('../handlers/cityTrash')

const update = require('../handlers/update')
const messenger = require('../handlers/messenger')
const moment = require('moment-timezone')

exports.homePage = async (req, res) => {
  res.render('index', {
    Obj: req.body.trashDay, 
    Txt: req.body.trashDay.message});
}

exports.update = async (req, res) => {
  // req.body.now = moment().tz('America/Los_Angeles');
  const dates = await update.updateDate();
  console.log(dates);
  

  // const trashDay = await cityTrash.updateDate();
  // const message = await cityTrash.setMessage(trashDay); 
  // const saveDay = await cityTrash.saveDay(trashDay, message);
  // req.body.trashDay = saveDay;
  // console.log(req.body.trashDay);
  // res.status(200).end();
}

exports.check = async (req, res, next) => {
  const trashDay = await cityTrash.checkDate();
  const message = await cityTrash.setMessage(trashDay); 
  const saveDay = await cityTrash.saveDay(trashDay, message);
  req.body.trashDay = saveDay;
  next();
}

exports.message = async (req, res) => {
  const day = req.body.trashDay;
  const trashDay = await messenger.checkWindow(day);
  console.log(trashDay);
  if (trashDay.trigger === true) {
    await messenger.email(trashDay.title, day);
  }
  res.status(200).end();
}