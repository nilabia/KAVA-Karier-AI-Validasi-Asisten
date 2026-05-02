const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const sendVerificationEmail = async (email, name, code) => {
  await transporter.sendMail({
    from: `"KAVA" <${process.env.MAIL_FROM}>`,
    to: email,
    subject: 'Verify Your KAVA Account',
    html: `
      <h2>Hello, ${name}!</h2>
      <p>Thank you for registering at KAVA.</p>
      <p>Your verification code is:</p>
      <h1 style="letter-spacing: 8px;">${code}</h1>
      <p>This code will not expire. Please do not share it with anyone.</p>
    `,
  });
};

module.exports = { sendVerificationEmail };