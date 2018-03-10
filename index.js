const express = require('express')
const path = require('path')
const cron = require('node-cron')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

console.log('yo');

cron.schedule('0 */45 16 * * *', function(){
  console.log('FETCHING DATE ON SCHEDULE');
  // getDate();
});
