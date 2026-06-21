const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { AppError } = require('../utils/errors');

class AuthService {
  async register({ name, email, password, role, phone, address }) {
    if (!['farmer', 'buyer'].includes(role)) {
      throw new AppError('Role must be farmer or buyer', 400);
    }

    const existing = await db('users').where({ email }).first();
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [user_id] = await db('users').insert({
      name, email, password_hash, role, phone, address,
    });

    return this.#buildAuthResponse(user_id);
  }

  async login({ email, password }) {
    const user = await db('users').where({ email }).first();
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const is_valid = await bcrypt.compare(password, user.password_hash);
    if (!is_valid) {
      throw new AppError('Invalid email or password', 401);
    }

    return this.#buildAuthResponse(user.id);
  }

  async getProfile(user_id) {
    const user = await db('users')
      .select('id', 'name', 'email', 'role', 'phone', 'address', 'created_at')
      .where({ id: user_id })
      .first();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async #buildAuthResponse(user_id) {
    const user = await this.getProfile(user_id);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    );

    return { user, token };
  }
}

module.exports = AuthService;
