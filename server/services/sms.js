const twilio = require('twilio')

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

async function sendSMS(to, body) {
  try {
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    })
    console.log(`SMS sent to ${to}`)
  } catch (err) {
    console.error('SMS failed:', err.message)
  }
}

module.exports = { sendSMS }
