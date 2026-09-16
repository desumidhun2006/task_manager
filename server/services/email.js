async function sendEmail(to, subject, text) {
  const { RESEND_API_KEY, EMAIL_FROM } = process.env
  if (!RESEND_API_KEY) {
    console.log(`Email dev mode to ${to}: ${subject} - ${text}`)
    return
  }
  try {
    const { Resend } = require('resend')
    const resend = new Resend(RESEND_API_KEY)
    await resend.emails.send({
      from: EMAIL_FROM || 'Task Manager <onboarding@resend.dev>',
      to,
      subject,
      text
    })
    console.log(`Email sent to ${to}`)
  } catch (err) {
    console.error('Email failed:', err.message)
  }
}

module.exports = { sendEmail }
