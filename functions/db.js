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
db.defaults({ users: [], outbox: [] }).write()

async function createUser({ id, name, email, password }) {
  try {
    const user = { id, name, email, password, created_at: Date.now() }
    await db.get('users').push(user).write()
    return await db.get('users').find({ id }).value()
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

async function getUserByEmail(email) {
  try {
    return await db.get('users').find({ email }).value()
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

async function getUserById(id) {
  try {
    return await db.get('users').find({ id }).value()
  } catch (error) {
    console.error('Error getting user by id:', error)
    return null
  }
}

async function getUserByVerificationToken(token) {
  try {
    return await db.get('users').find({ verificationToken: token }).value()
  } catch (error) {
    console.error('Error getting user by verification token:', error)
    return null
  }
}

async function getUserByResetToken(token) {
  try {
    return await db.get('users').find({ resetToken: token }).value()
  } catch (error) {
    console.error('Error getting user by reset token:', error)
    return null
  }

}
async function resetUsers() {
  try {
    await db.set('users', []).write()
  } catch (error) {
    console.error('Error resetting users:', error)
  }
}

async function updateUser(id, updates) {
  try {
    const user = db.get('users').find({ id })
    if (!user.value()) return null
    // assign updates
    await user.assign(updates).write()
    return db.get('users').find({ id }).value()
  } catch (error) {
    console.error('Error updating user:', error)
    return null
  }
}

async function addOutbox(entry) {
  try {
    await db.get('outbox').push(Object.assign({ created_at: Date.now() }, entry)).write()
    return true
  } catch (error) {
    console.error('Error adding outbox entry:', error)
    return false
  }
}

module.exports = { createUser, getUserByEmail, getUserById, getUserByVerificationToken, getUserByResetToken, resetUsers, updateUser, addOutbox, DB_PATH }
