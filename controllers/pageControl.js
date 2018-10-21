const cityTrash = require('../handlers/cityTrash')

exports.homePage = async (req, res) => {
  const trashDay = await cityTrash.checkDate();
  // console.log(trashDay);
  const message = await cityTrash.setMessage(trashDay);
  // console.log(message);
  const saveDay = await cityTrash.saveDay(trashDay, message);
  console.log(saveDay);
  res.render('index', {
    Obj: saveDay, 
    Txt: saveDay.message});
}