const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var trashSchema = new mongoose.Schema({
  name: String,
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


// var data = {
//   Now: {
//     date: now.format("LLLL"),
//     iso: now.toISOString(),
//     day: now.format("dddd")
//   },
//   Trash: {
//     date: t.format("LLLL"),
//     iso: t.toISOString(),
//     day: t.format("dddd"),
//     daysTill: tDayTill,
//     hrsTill: tHr,
//     fromNow: t.fromNow()
//   },
//   Recycling: {
//     date: r.format("LLLL"),
//     iso: r.toISOString(),
//     day: r.format("dddd"),
//     daysTill: rDayTill,
//     hrsTill: rHr,
//     fromNow: r.fromNow(),
//     isTrue: both
//   }
// };
