exports.homePage = (req, res) => {
  res.render('index', {
    Obj: { "name":"John", "age":30, "car":null }, 
    Txt: 'Yo'});
}
