const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('./db');
const logger = require('./logger')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const TOKEN_EXPIRES_IN = '7d';

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const { email, password } = body;
    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email and password are required' }) };
    }

    const normalized = email.toLowerCase();
    const user = await getUserByEmail(normalized);
    if (!user) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) };
    }

    if (user.verified === false) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Email not verified' }) };
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) };
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, user: { id: user.id, name: user.name, email: user.email } }),
    };
  } catch (err) {
    logger.error('Login error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Login failed' }) };
  }
};
