require('dotenv').config( { path: 'variables.env'});
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const getDay = require('./helpers/getDay');
const name = 'mytrashday';
require('./models/Trash');
const Trash = mongoose.model('Trash');

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
  const newData = await Trash.findOneAndUpdate({ name: current.name }, {
    message: message
  }, {new: true}).exec();
  mongoose.connection.close().then(console.log('Mongoose connection closed.'));
}


checkDate();
