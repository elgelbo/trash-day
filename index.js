const express = require('express')
const path = require('path')
const cron = require('node-cron')
const citytrash = require('./helpers/citytrash');
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res, next) => {
    citytrash.getDate()
    .catch((error) => {
      console.log(error);
      skip();
    });
    next();
  })
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
