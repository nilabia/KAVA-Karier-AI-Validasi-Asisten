const UserService = require('../services/UserService');
const AuthService = require('../services/AuthService');
const ClientError = require('../exceptions/ClientError');

const AuthHandler = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const userId = await UserService.verifyUserCredential(email, password);
      const accessToken = AuthService.generateAccessToken(userId);
      const refreshToken = AuthService.generateRefreshToken(userId);
      await AuthService.saveRefreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      next(error);
    }
  },

  async loginWithGoogle(req, res, next) {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        throw new ClientError('Google ID token is required', 400);
      }

      const userId = await UserService.loginWithGoogle(idToken);
      const accessToken = AuthService.generateAccessToken(userId);
      const refreshToken = AuthService.generateRefreshToken(userId);
      await AuthService.saveRefreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        message: 'Login with Google successful',
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const userId = await AuthService.verifyRefreshToken(refreshToken);
      const accessToken = AuthService.generateAccessToken(userId);

      res.status(200).json({
        status: 'success',
        message: 'Access token successfully updated',
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await AuthService.verifyRefreshToken(refreshToken);
      await AuthService.deleteRefreshToken(refreshToken);

      res.status(200).json({ status: 'success', message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthHandler;