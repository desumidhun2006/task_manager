const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')
const { sendEmail } = require('../services/email')
const { sendSMS } = require('../services/sms')

const router = express.Router()

function normalizePhone(phone) {
  if (!phone) return phone
  let p = phone.replace(/[\s\-()]/g, '')
  if (p.startsWith('+91')) p = p.slice(3)
  else if (p.startsWith('91') && p.length > 10) p = p.slice(2)
  return p
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    const normalizedPhone = normalizePhone(phone)

    const existing = await db('users').where({ email }).first()
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const existingPhone = await db('users').where({ phone: normalizedPhone }).first()
    if (existingPhone) return res.status(400).json({ message: 'Phone number already registered' })

    const password_hash = await bcrypt.hash(password, 10)
    const [user] = await db('users')
      .insert({ name, email, phone: normalizedPhone, password_hash })
      .returning(['id', 'name', 'email', 'phone'])

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user })
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await db('users').where({ email }).first()
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } })
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { method, value } = req.body
    if (!['email', 'phone'].includes(method) || !value) {
      return res.status(400).json({ message: 'Choose email or phone and provide value' })
    }
    const lookupValue = method === 'phone' ? normalizePhone(value) : value
    const user = await db('users').where(method === 'email' ? { email: lookupValue } : { phone: lookupValue }).first()
    if (!user) return res.status(404).json({ message: `${method} not registered` })

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires_at = new Date(Date.now() + 10 * 60 * 1000)
    await db('password_resets').where({ user_id: user.id }).del()
    await db('password_resets').insert({ user_id: user.id, code, expires_at })

    const msg = `Password reset code: ${code}. Valid 10 min.`
    if (method === 'email') await sendEmail(user.email, 'Password reset code', msg)
    else await sendSMS(user.phone, msg)

    const dev = !process.env.RESEND_API_KEY && !process.env.TWILIO_ACCOUNT_SID
    res.json({ message: 'Code sent', ...(dev ? { debugCode: code } : {}) })
  } catch (err) {
    res.status(500).json({ message: 'Failed to send code', error: err.message })
  }
})

router.post('/verify-code', async (req, res) => {
  try {
    const { method, value, code } = req.body
    if (!code) return res.status(400).json({ message: 'Code required' })

    const lookupValue = method === 'phone' ? normalizePhone(value) : value
    const user = await db('users').where(method === 'email' ? { email: lookupValue } : { phone: lookupValue }).first()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const row = await db('password_resets').where({ user_id: user.id, code }).first()
    if (!row) return res.status(400).json({ message: 'Invalid code' })
    if (new Date(row.expires_at) < new Date()) {
      await db('password_resets').where({ id: row.id }).del()
      return res.status(400).json({ message: 'Code expired' })
    }

    res.json({ message: 'Code verified' })
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const { method, value, code, newPassword } = req.body
    if (!code || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Code + 6-char password required' })
    }
    const lookupValue = method === 'phone' ? normalizePhone(value) : value
    const user = await db('users').where(method === 'email' ? { email: lookupValue } : { phone: lookupValue }).first()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const row = await db('password_resets').where({ user_id: user.id, code }).first()
    if (!row) return res.status(400).json({ message: 'Invalid code' })
    if (new Date(row.expires_at) < new Date()) {
      await db('password_resets').where({ id: row.id }).del()
      return res.status(400).json({ message: 'Code expired' })
    }

    const password_hash = await bcrypt.hash(newPassword, 10)
    await db('users').where({ id: user.id }).update({ password_hash, updated_at: new Date() })
    await db('password_resets').where({ user_id: user.id }).del()
    res.json({ message: 'Password reset. Login now.' })
  } catch (err) {
    res.status(500).json({ message: 'Reset failed', error: err.message })
  }
})

module.exports = router
