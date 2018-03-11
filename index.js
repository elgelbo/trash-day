const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const citytrash = require('./helpers/citytrash');
const PORT = process.env.PORT || 5000
express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', citytrash.checkDate)
  .get('/', (req, res) => {
    res.render('pages/index', {Dates: {trash: req.tDate, recycling: req.rDate}, text: {trash: 'trash text', recycling: 'recy text'}});
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
