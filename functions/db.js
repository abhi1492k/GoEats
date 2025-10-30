const path = require('path')
const fs = require('fs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const DB_DIR = path.join(__dirname, 'data')
const DB_PATH = path.join(DB_DIR, 'db.json')

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })

const adapter = new FileSync(DB_PATH)
const db = low(adapter)

// defaults
db.defaults({ users: [] }).write()

function createUser({ id, name, email, password }) {
  const user = { id, name, email, password, created_at: Date.now() }
  db.get('users').push(user).write()
  return db.get('users').find({ id }).value()
}

function getUserByEmail(email) {
  return db.get('users').find({ email }).value()
}

function getUserById(id) {
  return db.get('users').find({ id }).value()
}

function resetUsers() {
  db.set('users', []).write()
}

module.exports = { createUser, getUserByEmail, getUserById, resetUsers, DB_PATH }
