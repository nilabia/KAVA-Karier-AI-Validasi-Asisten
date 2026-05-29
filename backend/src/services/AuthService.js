const jwt = require('jsonwebtoken');
const pool = require('../utils/database');
const ClientError = require('../exceptions/ClientError');

const REFRESH_TOKEN_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

const AuthService = {
  generateAccessToken(userId) {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '3h',
    });
  },

  generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: REFRESH_TOKEN_EPIRES_IN,
    });
  },

  async saveRefreshToken(token) {
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);
    await pool.query(
      'INSERT INTO authentications (token, expires_at) VALUES ($1, $2)',
      [token, expiresAt]
    );
  },

  async verifyRefreshToken(token) {
    const result = await pool.query(
      'SELECT token FROM authentications WHERE token = $1',
      [token]
    );
    if (result.rows.length === 0) {
      throw new ClientError('Refresh token not valid', 400);
    }

    if (new Date() > new Date(result.rows[0].expires_at)) {
      await pool.query('DELETE FROM authentications WHERE token = $1', [token]);
      throw new ClientError('Refresh token has expired', 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return decoded.id;
    } catch {
      throw new ClientError('Refresh token not valid', 400);
    }
  },

  async deleteRefreshToken(token) {
    await pool.query('DELETE FROM authentications WHERE token = $1', [token]);
  },

  async cleanExpiredTokens() {
    await pool.query('DELETE FROM authentications WHERE expires_at < NOW()');
  }
};

module.exports = AuthService;