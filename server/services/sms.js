async function sendSMS(to, body) {
  const { FAST2SMS_API_KEY } = process.env
  if (!FAST2SMS_API_KEY) {
    console.log(`SMS dev mode to ${to}: ${body}`)
    return
  }
  try {
    const phone = to.replace(/\D/g, '').slice(-10)
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&variables_values=${encodeURIComponent(body)}&route=q&numbers=${phone}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.return) {
      console.log(`SMS sent to ${to}`)
    } else {
      console.error('SMS failed:', data.message)
    }
  } catch (err) {
    console.error('SMS failed:', err.message)
  }
}

module.exports = { sendSMS }
