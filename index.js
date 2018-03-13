const express = require('express')
require('dotenv').config( { path: 'variables.env'});
const mongoose = require('mongoose');
const path = require('path')
const bodyParser = require('body-parser');
const citytrash = require('./helpers/citytrash');
const PORT = process.env.PORT || 5000

// DB CONNECTION
mongoose.connect(process.env.MONGODB_URI).then(
  () => { console.log('Mongoose default connection open.') },
  err => { console.error(`err message ${err.message}`)}
); // see mognoose callback on connect: http://mongoosejs.com/docs/connections.html#callback
mongoose.Promise = global.Promise; //USE ES6 PROMISES see:http://mongoosejs.com/docs/promises.html#plugging-in-your-own-promises-library

require('./models/Trash');

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
