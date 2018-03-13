require('dotenv').config( { path: 'variables.env'});
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const getDay = require('./helpers/getDay');
const name = 'mytrashday';

mongoose.connect(process.env.MONGODB_URI).then(
  () => {
    console.log('Mongoose connection open.')
  },
  err => {
    console.error(`err message ${err.message}`)
  }
);
checkDate = async () => {
  const db = await getDay.getDaybyName(name);
  const current = await getDay.currentDay(db);
  const message = await getDay.message(current);
  console.log(current);
  mongoose.connection.close().then(console.log('Mongoose connection closed.'));
}


checkDate();
