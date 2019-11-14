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

var check = (exports.check = day => {
  // CHECK WINDOWS FOR MESSAGES

  const timeTill = day.trash.hrsTill;
  console.log(timeTill);
  console.log(day);
  console.log("now: " + moment());
  console.log("day: " + moment().day());

  if (day.payVictor === true) {
    if (timeTill >= -38.5 && timeTill <= -37.5) {
      return {
        title: "gardPre",
        trigger: true,
        current: moment().format("MMMM Do YYYY, h:mm:ss a"),
        tMinus: timeTill,
        it: day.trash.date
      };
    } else if (timeTill >= -26.5 && timeTill <= -25.5) {
      return {
        title: "gardDo",
        trigger: true,
        current: moment().format("MMMM Do YYYY, h:mm:ss a"),
        tMinus: timeTill,
        it: day.trash.date
      };
    } else {
      return "nah";
    }
  } else {
    if (timeTill >= -14.5 && timeTill <= -13.5) {
      return {
        title: "normPre",
        trigger: true,
        current: moment().format("MMMM Do YYYY, h:mm:ss a z"),
        tMinus: timeTill,
        it: day.trash.date
      };
    } else if (timeTill >= -1.5 && timeTill <= -0.5) {
      return {
        title: "normDo",
        trigger: true,
        current: moment().format("MMMM Do YYYY, h:mm:ss a z"),
        tMinus: timeTill,
        it: day.trash.date
      };
    } else {
      return "nah2";
    }
  }
});
// TODO: SET UP EMAIL TRANSPORT
exports.checkWindow = async (req, res, next) => {
  const checked = await check(req.body.trashDay);
  // DEBUG FOR SERVER
  console.log(checked);
  // TODO: MOVE TO MSG GENERATOR
  // FLAG
  if (checked.title === "gardPre") {
    const message =  `Don't forget to pay Victor tomorrow!`;
    console.log(checked.title + ": " + message);
    await email.sendEmail(message, process.env.EMAIL_TO);
  }
  if (checked.title === "gardDo") {
    const message = `Don't forget to pay Victor today!`;
    await email.sendEmail(message, process.env.EMAIL_TO);
  }
  if (checked.title === "normPre" || checked.title === "normDo") {
    await email.sendEmail(req.body.trashDay.message, process.env.EMAIL_TO);
  } else if (checked.title === "altWarn") {
    const message = `No trash pickup on Friday! ${req.body.trashDay.message}`;
    await email.sendEmail(message, process.env.EMAIL_TO);
  } else if (checked.title === "altWarnDay") {
    const message = `No trash pickup today! ${req.body.trashDay.message}`;
    await email.sendEmail(message, process.env.EMAIL_TO);
  }
  next();
};
