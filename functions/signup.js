const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const TOKEN_EXPIRES_IN = '7d';

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const { name, email, password } = body;

    // basic validations
    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email and password are required' }) };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email address' }) };
    }

    if (typeof password !== 'string' || password.length < 8) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Password must be at least 8 characters' }) };
    }

    const normalized = email.toLowerCase();
    const exists = await getUserByEmail(normalized);
    if (exists) {
      return { statusCode: 409, body: JSON.stringify({ error: 'User already exists' }) };
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = Date.now().toString();
    const newUser = await createUser({ id, name: name || '', email: normalized, password: hashed });
    if (!newUser) {
      throw new Error('Failed to create user');
    }

    const token = jwt.sign({ sub: id, email: newUser.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } }),
    };
  } catch (err) {
    console.error('Signup error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Signup failed' }) };
  }
};
