const moment = require("moment");
const email = require("../handlers/email");

altTill = now => {
  if (now.day() <= 5) {
    const nextT = now
      .clone()
      .milliseconds(0)
      .seconds(0)
      .minutes(0)
      .hours(8)
      .day(5);
    return now.diff(nextT, "hours", true);
  } else {
    const nextT = now
      .clone()
      .milliseconds(0)
      .seconds(0)
      .minutes(0)
      .hours(8)
      .day(5)
      .add(1, "weeks");
    return now.diff(nextT, "hours", true);
  }
};

// var check = (exports.check = day => {
//   // CHECK WINDOWS FOR MESSAGES
//   console.log(day);
  
//   const timeTill = day.trash.hrsTill;
//   if (day.payVictor === true) {
//     if (timeTill >= -38.5 && timeTill <= -37.5) {
//       return {
//         title: "gardPre",
//         trigger: true,
//         current: moment().format("MMMM Do YYYY, h:mm:ss a"),
//         tMinus: timeTill,
//         it: day.trash.date
//       };
//     }
//   } else {
//     if (timeTill >= -14.5 && timeTill <= -13.5) {
//       return {
//         title: "normPre",
//         trigger: true,
//         current: moment().format("MMMM Do YYYY, h:mm:ss a z"),
//         tMinus: timeTill,
//         it: day.trash.date
//       };
//     } else if (timeTill >= -1.5 && timeTill <= -0.5) {
//       return {
//         title: "normDo",
//         trigger: true,
//         current: moment().format("MMMM Do YYYY, h:mm:ss a z"),
//         tMinus: timeTill,
//         it: day.trash.date
//       };
//     } else {
//       return {
//         title: "none",
//         trigger: false,
//         current: moment().format("MMMM Do YYYY, h:mm:ss a z"),
//         tMinus: timeTill,
//         it: day.trash.date
//       };
//     }
//   }

// });
// TODO: SET UP EMAIL TRANSPORT
exports.checkWindow = async (req, res, next) => {
  // const checked = await check(req.body.trashDay);
  // DEBUG FOR SERVER
  // console.log(req.body.trashDay);
  const day = req.body.trashDay;
  console.log('start');
  console.log(day);


  if (day.trash.hrsTill <= 61.5 && day.trash.hrsTill >= 62.5) {
    if (day.payVictor === true) {
        if (day.holiday === true) {
          console.log('It is a holiday');
          await email.sendEmail(day.message); 
      }
    }
  } else {
    if (day.trash.hrsTill <= 37.5 && day.trash.hrsTill >= 38.5) {
      if (day.payVictor === true) {
        await email.sendEmail(day.message); 
      }
    }  
  }
  if (day.trash.hrsTill >= -14.5 && day.trash.hrsTill <= -13.5) {
      await email.sendEmail(day.message); 
  }
  if (day.trash.hrsTill >= -1.5 && day.trash.hrsTill <= -0.5) {
      await email.sendEmail(day.message); 
  }
  console.log('end');
  next();
};

exports.testMail = async (req, res, next) => {
  await email.testEmail(req.body.trashDay.message);
}