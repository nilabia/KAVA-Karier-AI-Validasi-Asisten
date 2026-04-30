const UserService = require('../services/UserService');
const AuthService = require('../services/AuthService');

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
      throw new ClientError('Google ID token diperlukan', 400);
    }

    const userId = await UserService.loginWithGoogle(idToken);
    const accessToken = AuthService.generateAccessToken(userId);
    const refreshToken = AuthService.generateRefreshToken(userId);
    await AuthService.saveRefreshToken(refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Login dengan Google berhasil',
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

      res.json({
        status: 'success',
        message: 'Access token berhasil diperbarui',
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

      res.json({ status: 'success', message: 'Logout berhasil' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthHandler;