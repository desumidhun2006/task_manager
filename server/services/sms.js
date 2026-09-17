async function sendSMS(to, body) {
  const { TEXTBEE_API_KEY } = process.env
  if (!TEXTBEE_API_KEY) {
    console.log(`SMS dev mode to ${to}: ${body}`)
    return
  }
  try {
    const phone = to.replace(/\D/g, '').slice(-10)
    const res = await fetch('https://api.textbee.dev/api/v1/gateway/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TEXTBEE_API_KEY
      },
      body: JSON.stringify({
        recipients: [`+91${phone}`],
        message: body
      })
    })
    const data = await res.json()
    if (data.data?.success) {
      console.log(`SMS sent to ${to}`)
    } else {
      console.error('SMS failed:', data)
    }
  } catch (err) {
    console.error('SMS failed:', err.message)
  }
}

module.exports = { sendSMS }
