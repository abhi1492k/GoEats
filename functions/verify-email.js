const { getUserByVerificationToken, updateUser } = require('./db')
const logger = require('./logger')

exports.handler = async function(event) {
  try {
    // allow GET from link or POST with JSON { token }
    const token = (event.queryStringParameters && event.queryStringParameters.token) || (event.body ? JSON.parse(event.body || '{}').token : null)
    if (!token) return { statusCode: 400, body: JSON.stringify({ error: 'Token required' }) }

  // find user by verificationToken
  const user = await getUserByVerificationToken(token)
  if (!user) return { statusCode: 404, body: JSON.stringify({ error: 'Invalid token' }) }

  await updateUser(user.id, { verified: true, verificationToken: null })
    return { statusCode: 200, body: JSON.stringify({ message: 'Email verified' }) }
  } catch (err) {
    logger.error('verify-email error', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Verify failed' }) }
  }
}
