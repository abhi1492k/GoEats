const { addOutbox } = require('./db')
const logger = require('./logger')

async function sendEmail({ to, subject, text, html }) {
  try {
    // In dev we push email to outbox; in production replace this with an SMTP / provider call
    await addOutbox({ to, subject, text, html })
    logger.info('Queued email to', to, 'subject:', subject)
    return true
  } catch (err) {
    logger.error('sendEmail error', err)
    return false
  }
}

module.exports = { sendEmail }
