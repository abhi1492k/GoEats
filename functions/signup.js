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

    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email and password are required' }) };
    }

    const normalized = email.toLowerCase();
    const exists = getUserByEmail(normalized);
    if (exists) {
      return { statusCode: 409, body: JSON.stringify({ error: 'User already exists' }) };
    }

    const hashed = bcrypt.hashSync(password, 10);
    const id = Date.now().toString();
    const newUser = createUser({ id, name: name || '', email: normalized, password: hashed });

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
