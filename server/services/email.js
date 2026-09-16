async function sendEmail(to, subject, text) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(`Email dev mode to ${to}: ${subject} - ${text}`)
    return
  }
  try {
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    })
    await transporter.sendMail({ from: SMTP_USER, to, subject, text })
    console.log(`Email sent to ${to}`)
  } catch (err) {
    console.error('Email failed:', err.message)
  }
}

module.exports = { sendEmail }
