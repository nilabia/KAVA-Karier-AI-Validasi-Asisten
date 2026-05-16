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

const sendResetPasswordEmail = async (email, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: '"KAVA" <${process.env.MAIL_FROM}>',
    to: email,
    subject: 'Reset Your KAVA Password',
    html: `
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background: #e63946; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};


module.exports = { sendVerificationEmail, sendResetPasswordEmail };