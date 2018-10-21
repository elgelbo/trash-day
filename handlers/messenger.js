// const scrape = require('./scrape')
const moment = require('moment')
// const mongoose = require('mongoose');
// const Trash = require('../models/Trash');


exports.checkWindow = async (day) => {
  // console.log(day);
  const now = moment();
  const dayName = day.trash.day;
  const trash = day.trash.iso;
  // const nowDayName = now.day();
  // const nextNorm = now.day(5).hours(7).minute(0).millisecond(0);
  if (dayName === 'Friday') {
    const normWindow = now.isBetween(moment(trash).subtract({ hours: 135 }), moment(trash).subtract({ hours: 0 }));
    return { title: 'normWindow', trigger: normWindow };
  }
  // else {
  //   if (nowDayName === 4) {
  //     const altWarn = now.isBetween(moment(nextNorm).subtract({ hours: 135 }), moment(nextNorm).subtract({ hours: 0 }));
  //     return { title: 'altWarn', trigger: altWarn };
  //   } else {
  //     const altWindow = now.isBetween(moment(trash).subtract({ hours: 135 }), moment(trash).subtract({ hours: 0 }));
  //     return { title: 'altWindow', trigger: altWindow };;
  //   }
  // }
}