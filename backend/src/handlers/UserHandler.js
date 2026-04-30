const UserService = require('../services/UserService');

const UserHandler = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const { user, verificationCode } = await UserService.register({ name, email, password });

      

      res.status(201).json({
        status: 'success',
        message: 'Registration successful. Check your email for the verification code.',
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

      res.json({ status: 'success', message: result.message });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await UserService.getUserById(req.user.id);
      res.json({ status: 'success', data: { user } });
    } catch (error) {
      next(error);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      await UserService.updatePassword(req.user.id, { oldPassword, newPassword });
      res.json({ status: 'success', message: 'Password successfully updated' });
    } catch (error) {
      next(error);
    }
  },

  async deleteAccount(req, res, next) {
    try {
      await UserService.deleteUser(req.user.id);
      res.json({ status: 'success', message: 'Account successfully deleted' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserHandler;