const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const USERS_PATH = path.join(__dirname, 'data', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const TOKEN_EXPIRES_IN = '7d';

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

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

    const users = readUsers();
    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) };
    }

    const ok = bcrypt.compareSync(password, user.password);
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
    return { statusCode: 500, body: JSON.stringify({ error: 'Login failed' }) };
  }
};
