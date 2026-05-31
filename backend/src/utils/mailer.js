const sendVerificationEmail = async (email, code) => {
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'KAVA', email: process.env.MAIL_FROM },
      to: [{ email }],
      subject: 'Verify Your KAVA Account',
      htmlContent: `
        <h2>Welcome to KAVA!</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 8px">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
      `,
    }),
  });
};

const sendResetPasswordEmail = async (email, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'KAVA', email: process.env.MAIL_FROM },
      to: [{ email }],
      subject: 'Reset Your KAVA Password',
      htmlContent: `
        <h2>Hello, ${name}!</h2>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background: #e63946; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      `,
    }),
  });
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };