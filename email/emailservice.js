const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'bkngadventure@gmail.com', //  email
    pass: 'asmaaalshimaadoaanada' //  app password
  }
});

// Function to send an email
const sendEmail = (to, subject, text, html) => {
  const mailOptions = {
    from: 'booking.online.alx@gmail.com',
    to,
    subject,
    text,
    html
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
