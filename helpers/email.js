'use strict';
const nodemailer = require('nodemailer');

var sendEmail = (message) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      // secure: false, // true for 465, false for other ports
      auth: {
        user: 'apikey', // generated ethereal user
        pass: process.env.SENDGRID_KEY
      }
  });

  // setup email data with unicode symbols
  const mailOptions = {
      from: '"👻" <mgelbman@gmail.com>', // sender address
      to: 'mgelbman@gmail.com', // list of receivers
      subject: 'Trash Day is Tomorrow 💩 💩 💩 💩 💩', // Subject line
      text: message, // plain text body
      // html: '<b>Hello world?</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
  });
}
module.exports.sendEmail = sendEmail;
