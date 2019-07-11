exports.update = async (req, res) => {
    console.log(req.body);
    res.status(200).end();
}

exports.home = async (req, res) => {
    res.render('index', {
        Obj: req.body.trashDay,
        Txt: req.body.trashDay.message
    });
}