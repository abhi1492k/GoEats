const crypto = require('crypto')
const { getUserByEmail, updateUser } = require('./db')
const { sendEmail } = require('./email')
const logger = require('./logger')

const FUNCTIONS_BASE = process.env.FUNCTIONS_BASE || 'http://localhost:8888'

exports.handler = async function(event) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
    const body = event.body ? JSON.parse(event.body) : {}
    const { email } = body
    if (!email) return { statusCode: 400, body: JSON.stringify({ error: 'Email required' }) }

    const normalized = email.toLowerCase()
    const user = await getUserByEmail(normalized)
    if (!user) return { statusCode: 200, body: JSON.stringify({ message: 'If the email exists, a reset link was sent' }) }

    const resetToken = crypto.randomBytes(20).toString('hex')
    const resetExpires = Date.now() + 1000 * 60 * 60 // 1 hour
    await updateUser(user.id, { resetToken, resetExpires })

    const resetUrl = `${FUNCTIONS_BASE}/.netlify/functions/reset-password?token=${resetToken}`
    await sendEmail({ to: user.email, subject: 'Password reset', text: `Reset: ${resetUrl}`, html: `<p>Reset: <a href="${resetUrl}">${resetUrl}</a></p>` })

    return { statusCode: 200, body: JSON.stringify({ message: 'If the email exists, a reset link was sent' }) }
  } catch (err) {
    logger.error('request-reset error', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Request reset failed' }) }
  }
}
