const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const pool = require('../utils/database');
const NotFoundError = require('../exceptions/NotFoundError');
const ClientError = require('../exceptions/ClientError');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const UserService = {
  async register({ name, email, password }) {
    const check = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (check.rows.length > 0) {
      throw new ClientError('Email is already registered', 409);
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, verification_code)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email`,
      [id, name, email, hashedPassword, verificationCode]
    );

    return { user: result.rows[0], verificationCode };
  },

  async loginWithGoogle(idToken) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    const existing = await pool.query(
      'SELECT id, auth_provider FROM users WHERE email = $1',
      [email]
    );

    let userId;

    if (existing.rows.length > 0) {
      const existingUser = existing.rows[0];

   
      if (existingUser.auth_provider !== 'google') {
        throw new ClientError(
          'This email is already registered with a password. Please login with your email and password.',
          409
        );
      }

      userId = existingUser.id;
    } else {
      const id = uuidv4();
      const result = await pool.query(
        `INSERT INTO users (id, name, email, google_id, auth_provider, is_verified)
         VALUES ($1, $2, $3, $4, 'google', true) RETURNING id`,
        [id, name, email, googleId]
      );
      userId = result.rows[0].id;
    }

    return userId;
  },

  async verifyEmail({ email, code }) {
    const result = await pool.query(
      'SELECT id, verification_code, is_verified FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    const user = result.rows[0];

    if (user.is_verified) {
      throw new ClientError('Email is already verified', 400);
    }

    if (user.verification_code !== code) {
      throw new ClientError('Verification code is not valid', 400);
    }

    await pool.query(
      `UPDATE users SET is_verified = true, verification_code = null,
       updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [user.id]
    );

    return { message: 'Email successfully verified' };
  },

  async verifyUserCredential(email, password) {
    const result = await pool.query(
      'SELECT id, password, is_verified FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      throw new ClientError('Email or password is incorrect', 401);
    }

    const { id, password: hashed, is_verified } = result.rows[0];

    if (!is_verified) {
      throw new ClientError('Account is not verified. Please check your email.', 403);
    }

    const isValid = await bcrypt.compare(password, hashed);
    if (!isValid) {
      throw new ClientError('Email or password is incorrect', 401);
    }

    return id;
  },

  async getUserById(id) {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }
    return result.rows[0];
  },

  async deleteUser(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }
  },

  async updatePassword(id, { oldPassword, newPassword }) {
    const result = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    const isValid = await bcrypt.compare(oldPassword, result.rows[0].password);
    if (!isValid) {
      throw new ClientError('Old password does not match', 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashed, id]
    );
  },

  async updateName(id, name) {
    const result = await pool.query(
      'UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email',
      [name, id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }
    return result.rows[0];
  }

};

module.exports = UserService;