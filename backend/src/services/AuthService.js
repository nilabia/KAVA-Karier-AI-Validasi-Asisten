const jwt = require('jsonwebtoken');
const pool = require('../utils/database');
const ClientError = require('../exceptions/ClientError');

const AuthService = {
  generateAccessToken(userId) {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '3h',
    });
  },

  generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_KEY);
  },

  async saveRefreshToken(token) {
    await pool.query('INSERT INTO authentications (token) VALUES ($1)', [token]);
  },

  async verifyRefreshToken(token) {
    const result = await pool.query(
      'SELECT token FROM authentications WHERE token = $1',
      [token]
    );
    if (result.rows.length === 0) {
      throw new ClientError('Refresh token not valid', 400);
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
};

module.exports = AuthService;