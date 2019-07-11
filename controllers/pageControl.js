exports.home = async (req, res) => {
  res.render('index', {
      Obj: req.body.trashDay,
      Txt: req.body.trashDay.message
  });
}