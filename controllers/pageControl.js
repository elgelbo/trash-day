exports.home = async (req, res) => {
  res.render('index', {
      title: 'Next',
      Obj: req.body.trashDay,
      Txt: req.body.trashDay.message
  });
}

exports.update = async (req, res) => {
  console.log('Good doggie');
  res.redirect('/')
}

exports.message = async (req, res) => {
  res.redirect('/')
}