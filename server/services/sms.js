async function sendSMS(to, body) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.log(`SMS dev mode to ${to}: ${body}`)
    return
  }
  try {
    const twilio = require('twilio')
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    await client.messages.create({ body, from: TWILIO_PHONE_NUMBER, to })
    console.log(`SMS sent to ${to}`)
  } catch (err) {
    console.error('SMS failed:', err.message)
  }
}

module.exports = { sendSMS }
