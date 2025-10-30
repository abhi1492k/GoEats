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

function writeUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

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

    const users = readUsers();
    const exists = users.find((u) => u.email === email.toLowerCase());
    if (exists) {
      return { statusCode: 409, body: JSON.stringify({ error: 'User already exists' }) };
    }

    const hashed = bcrypt.hashSync(password, 10);
    const id = Date.now().toString();
    const newUser = { id, name: name || '', email: email.toLowerCase(), password: hashed };
    users.push(newUser);
    writeUsers(users);

    const token = jwt.sign({ sub: id, email: newUser.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, user: { id, name: newUser.name, email: newUser.email } }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Signup failed' }) };
  }
};
