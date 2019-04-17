const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var trashSchema = new mongoose.Schema({
  name: String,
  message: String,
  holiday: Boolean,
  update: String,
  scrape: String,
  payVictor: Boolean,
  trash: {
    date: String,
    iso: Date,
    day: String,
    daysTill: Number,
    hrsTill: Number,
    fromNow: String
  },
  recycling: {
    date: String,
    iso: Date,
    day: String,
    daysTill: Number,
    hrsTill: Number,
    fromNow: String,
    isTrue: Boolean
  }
});

module.exports = mongoose.model('Trash', trashSchema)