const bcrypt = require('bcryptjs')
const { getUserByResetToken, updateUser } = require('./db')
const logger = require('./logger')

exports.handler = async function(event) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
    const body = event.body ? JSON.parse(event.body) : {}
    const { token, password } = body
    if (!token || !password) return { statusCode: 400, body: JSON.stringify({ error: 'Token and new password required' }) }
    if (typeof password !== 'string' || password.length < 8) return { statusCode: 400, body: JSON.stringify({ error: 'Password must be at least 8 characters' }) }

    const user = await getUserByResetToken(token)
    if (!user) return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or expired token' }) }
    if (!user.resetExpires || Date.now() > user.resetExpires) return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or expired token' }) }

    const hashed = await bcrypt.hash(password, 10)
    await updateUser(user.id, { password: hashed, resetToken: null, resetExpires: null })

    return { statusCode: 200, body: JSON.stringify({ message: 'Password reset successful' }) }
  } catch (err) {
    logger.error('reset-password error', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Reset failed' }) }
  }
}
