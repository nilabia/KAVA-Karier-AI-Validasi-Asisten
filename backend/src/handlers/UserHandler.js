const UserService = require('../services/UserService');
const { sendVerificationEmail } = require('../utils/mailer');

const UserHandler = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const { user, verificationCode } = await UserService.register({ name, email, password });

      await sendVerificationEmail(email, name, verificationCode);

      res.status(201).json({
        status: 'success',
        message: 'Registration successful. Please check your email for the verification code.',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(req, res, next) {
    try {
      const { email, code } = req.body;
      const result = await UserService.verifyEmail({ email, code });

      res.status(200).json({ status: 'success', message: result.message });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await UserService.getUserById(req.user.id);
      res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
      next(error);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      await UserService.updatePassword(req.user.id, { oldPassword, newPassword });
      res.status(200).json({ status: 'success', message: 'Password successfully updated' });
    } catch (error) {
      next(error);
    }
  },

  async updateName(req, res, next) {
    try {
      const { name } = req.body;
      await UserService.updateName(req.user.id, name);
      res.status(200).json({ status: 'success', message: 'Name successfully updated' });
    } catch (error) {
      next(error);
    }
  },

  async deleteAccount(req, res, next) {
    try {
      await UserService.deleteUser(req.user.id);
      res.status(200).json({ status: 'success', message: 'Account successfully deleted' });
    } catch (error) {
      next(error);
    }
  },

  async setPassword(req, res, next) {
    try {
      const { newPassword } = req.body;
      await UserService.setPassword(req.user.id, newPassword);
      res.status(200).json({ status: 'success', message: 'Password successfully set' });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const { name, token } = await UserService.forgotPassword(email);
      const { sendResetPasswordEmail } = require('../utils/mailer');
      await sendResetPasswordEmail(email, name, token);
      res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to your email' });
    } catch (error) {
      next(error);
    }
  },
      
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      await UserService.resetPassword(token, newPassword);
      res.status(200).json({ status: 'success', message: 'Password successfully reset' });
    } catch (error) {
      next(error);
    }
  },

  async resendOtp(req, res, next) {
    try {
      const { email } = req.body;
      const verificationCode = await UserService.resendOtp(email);
      const { sendVerificationEmail } = require('../utils/mailer');
      await sendVerificationEmail(email, verificationCode);
      res.status(200).json({
        status: 'success',
        message: 'Verification code resent. Please check your email.',
      });
    } catch (error) {
      next(error);
    }
  },
}
    

module.exports = UserHandler;