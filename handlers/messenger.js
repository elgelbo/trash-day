const moment = require('moment')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.checkWindow = async (day) => {
  const now = moment();
  const trash = day.trash.iso;
  const normStart =  moment(trash).subtract({ hours: 14.5 });
  const normEnd =  moment(trash).subtract({ hours: 13.5 })
  const nextNorm = moment().day(5).hours(8).minute(0).millisecond(0);
  const normPre = now.isBetween(normStart, normEnd);
  const normDo = now.isBetween(moment(trash).subtract({ hours: 2 }), moment(trash).subtract({ hours: 1 }));
  const altWarn = now.isBetween(moment(nextNorm).subtract({ hours: 14.5 }), moment(nextNorm).subtract({ hours: 13.5 }));
  if (normPre === true || normDo === true || altWarn === true) {
    return { title: 'normWindow', trigger: true, tMinus: day.trash.hrsTill, it: moment(day.trash.date).format('MMMM Do YYYY, h:mm:ss a') };
  }  else {
    return { trigger: false, tMinus: day.trash.hrsTill, triggerStart: normStart.format('MMMM Do YYYY, h:mm:ss a'), triggerEnd: normEnd.format('MMMM Do YYYY, h:mm:ss a'), it: moment(day.trash.date).format('MMMM Do YYYY, h:mm:ss a')  };
  }
}

sendEmail = (message) => {
  const msg = {
    to: 'mgelbman@gmail.com, ertuel@gmail.com',
    from: 'mgelbman@gmail.com',
    subject: `${message}` + '💩 💩 💩 💩 💩',
    text: `${message}` + '💩 💩 💩 💩 💩',
    html: '<html lang="en"><head>' +
      '  <title>' + `${message}` + '💩 💩 💩 💩 💩' + '</title>' +
      '  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1">' +
      '  <meta http-equiv="X-UA-Compatible" content="IE=edge" />' +
      '  <style type="text/css">' +
      '    /* CLIENT-SPECIFIC STYLES */' +
      '' +
      '    body,' +
      '    table,' +
      '    td,' +
      '    a {' +
      '      -webkit-text-size-adjust: 100%;' +
      '      -ms-text-size-adjust: 100%;' +
      '    }' +
      '' +
      '    table,' +
      '    td {' +
      '      mso-table-lspace: 0pt;' +
      '      mso-table-rspace: 0pt;' +
      '    }' +
      '' +
      '    img {' +
      '      -ms-interpolation-mode: bicubic;' +
      '    }' +
      '' +
      '    /* RESET STYLES */' +
      '' +
      '    img {' +
      '      border: 0;' +
      '      height: auto;' +
      '      line-height: 100%;' +
      '      outline: none;' +
      '      text-decoration: none;' +
      '    }' +
      '' +
      '    table {' +
      '      border-collapse: collapse !important;' +
      '    }' +
      '' +
      '    body {' +
      '      height: 100% !important;' +
      '      margin: 0 !important;' +
      '      padding: 0 !important;' +
      '      width: 100% !important;' +
      '    }' +
      '  </style>' +
      '</head>' +
      '' +
      '<body style="background-color: aliceblue; margin: 0 !important; padding: 60px 0 60px 0 !important;">' +
      '  <table border="0" cellspacing="0" cellpadding="0" role="presentation" width="100%">' +
      '    <tr>' +
      '      <td bgcolor="aliceblue" style="font-size: 0;">&?nbsp;</td>' +
      '      <td bgcolor="white" width="600" style="border-radius: 4px; color: grey; font-family: sans-serif; font-size: 18px; line-height: 28px; padding: 40px 40px;">' +
      '        <article>' +
      '          <h1 style="color: black; font-size: 32px; font-weight: bold; line-height: 36px; margin: 0 0 30px 0;">' + `${message}` + '</h1>' +
      '          <img alt="placeholder image" src="https://source.unsplash.com/YzSZN3qvHeo/1200x600" height="300" width="600" style="background-color: black; color: white; display: block; font-family: sans-serif; font-size: 18px; font-weight: bold; height: auto; max-width: 100%; text-align: center; width: 100%;">' +
      '          <p style="margin: 30px 0 30px 0;">Hey there! Dont\' forget that trash day is coming up. Please remember to take the cans out. You can always check to find out when trash day is and if it is a recycling week. </p>' +
      '          <p style="margin: 30px 0 30px 0; text-align: center;">' +
      '            <a href="https://trashday.herokuapp.com/" target="_blank" style="font-size: 18px; font-family: sans-serif; color: #ffffff; text-decoration: none; border-radius: 8px; -webkit-border-radius: 8px; background-color: dodgerblue; border-top: 20px solid dodgerblue; border-bottom: 18px solid dodgerblue; border-right: 40px solid dodgerblue; border-left: 40px solid dodgerblue; display: inline-block;">Check Trash Day →</a>' +
      '          </p>' +
      '        </article>' +
      '      </td>' +
      '      <td bgcolor="aliceblue" style="font-size: 0;">&?nbsp;</td>' +
      '    </tr>' +
      '  </table>' +
      '</body>' +
      '' +
      '</html>' // html body,
  };
  sgMail.send(msg);
}

exports.email = async (title, day) => {
  if (title === 'normWindow') {
    await sendEmail(day.message);
  } else if (title === 'altWindow') {
    await sendEmail(day.message);
  } else if (title === 'altWarn') {
    const message = `No trash pickup on Friday! ${day.message}`
    await sendEmail(message);
  }
}