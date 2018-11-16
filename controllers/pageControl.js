const cityTrash = require('../handlers/cityTrash')
const messenger = require('../handlers/messenger')

exports.homePage = async (req, res) => {
  res.render('index', {
    Obj: req.body.trashDay, 
    Txt: req.body.trashDay.message});
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

exports.update = async (req, res) => {
  console.log(req.body.trashDay);
  res.status(200).end();
}