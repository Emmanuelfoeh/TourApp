const nodemailer = require('nodemailer');


const sendEmail = async option =>{
  // Create email transpoter
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });


  // Define the email options

  const mailOptions = {
    from: 'Emmanuel Foeh <admin@gmail.com>',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  // Send the mail
  await transport.sendMail(mailOptions);
}

module.exports = sendEmail;


