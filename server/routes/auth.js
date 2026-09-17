const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')
const { sendEmail } = require('../services/email')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email } = req.body
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' })

    const existing = await db('users').where({ email }).first()
    if (existing) {
      if (!existing.password_hash) {
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expires_at = new Date(Date.now() + 10 * 60 * 1000)
        await db('password_resets').where({ user_id: existing.id }).del()
        await db('password_resets').insert({ user_id: existing.id, code, expires_at })
        const msg = `Your verification code: ${code}. Valid 10 min.`
        await sendEmail(existing.email, 'Verify your email', msg)
        const dev = !process.env.RESEND_API_KEY
        return res.status(201).json({ message: 'Verification code sent', ...(dev ? { debugCode: code } : {}) })
      }
      return res.status(400).json({ message: 'Email already registered' })
    }

    const [user] = await db('users')
      .insert({ name, email, password_hash: null, email_verified: false })
      .returning(['id', 'name', 'email'])

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires_at = new Date(Date.now() + 10 * 60 * 1000)
    await db('password_resets').insert({ user_id: user.id, code, expires_at })

    const msg = `Your verification code: ${code}. Valid 10 min.`
    await sendEmail(user.email, 'Verify your email', msg)

    const dev = !process.env.RESEND_API_KEY
    res.status(201).json({ message: 'Verification code sent', ...(dev ? { debugCode: code } : {}) })
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message })
  }
})

router.post('/verify-signup', async (req, res) => {
  try {
    const { email, code } = req.body
    if (!code) return res.status(400).json({ message: 'Code required' })

    const user = await db('users').where({ email }).first()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const row = await db('password_resets').where({ user_id: user.id, code }).first()
    if (!row) return res.status(400).json({ message: 'Invalid code' })
    if (new Date(row.expires_at) < new Date()) {
      await db('password_resets').where({ id: row.id }).del()
      return res.status(400).json({ message: 'Code expired' })
    }

    await db('users').where({ id: user.id }).update({ email_verified: true, updated_at: new Date() })
    await db('password_resets').where({ user_id: user.id }).del()

    const tempToken = jwt.sign({ id: user.id, purpose: 'set-password' }, process.env.JWT_SECRET, { expiresIn: '15m' })
    res.json({ message: 'Email verified', tempToken })
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message })
  }
})

router.post('/set-password', async (req, res) => {
  try {
    const { tempToken, password } = req.body
    if (!tempToken || !password || password.length < 6) {
      return res.status(400).json({ message: 'Token + 6-char password required' })
    }

    let decoded
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET)
    } catch {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }
    if (decoded.purpose !== 'set-password') return res.status(400).json({ message: 'Invalid token' })

    const user = await db('users').where({ id: decoded.id }).first()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const password_hash = await bcrypt.hash(password, 10)
    await db('users').where({ id: user.id }).update({ password_hash, updated_at: new Date() })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: 'Failed to set password', error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await db('users').where({ email }).first()
    if (!user) return res.status(400).json({ message: 'Account not found. Please sign up.' })
    if (!user.password_hash) return res.status(400).json({ message: 'Account not completed. Please sign up again.' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' })

    if (!user.email_verified) return res.status(403).json({ message: 'Email not verified. Check your inbox.' })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email required' })

    const user = await db('users').where({ email }).first()
    if (!user) return res.status(404).json({ message: 'Email not registered' })

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires_at = new Date(Date.now() + 10 * 60 * 1000)
    await db('password_resets').where({ user_id: user.id }).del()
    await db('password_resets').insert({ user_id: user.id, code, expires_at })

    const msg = `Password reset code: ${code}. Valid 10 min.`
    await sendEmail(user.email, 'Password reset code', msg)

    const dev = !process.env.RESEND_API_KEY
    res.json({ message: 'Code sent', ...(dev ? { debugCode: code } : {}) })
  } catch (err) {
    res.status(500).json({ message: 'Failed to send code', error: err.message })
  }
})

router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body
    if (!code) return res.status(400).json({ message: 'Code required' })

    const user = await db('users').where({ email }).first()
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
    const { email, code, newPassword } = req.body
    if (!code || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Code + 6-char password required' })
    }

    const user = await db('users').where({ email }).first()
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

router.post('/request-delete', auth, async (req, res) => {
  try {
    const user = await db('users').where({ id: req.user.id }).first()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires_at = new Date(Date.now() + 10 * 60 * 1000)
    await db('password_resets').where({ user_id: user.id }).del()
    await db('password_resets').insert({ user_id: user.id, code, expires_at })

    await sendEmail(user.email, 'Delete account verification code', `Your delete account code: ${code}. Valid 10 min.`)

    const dev = !process.env.RESEND_API_KEY
    res.json({ message: 'Code sent', ...(dev ? { debugCode: code } : {}) })
  } catch (err) {
    res.status(500).json({ message: 'Failed to send code', error: err.message })
  }
})

router.post('/confirm-delete', auth, async (req, res) => {
  try {
    const { code } = req.body
    if (!code) return res.status(400).json({ message: 'Code required' })

    const user = await db('users').where({ id: req.user.id }).first()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const row = await db('password_resets').where({ user_id: user.id, code }).first()
    if (!row) return res.status(400).json({ message: 'Invalid code' })
    if (new Date(row.expires_at) < new Date()) {
      await db('password_resets').where({ id: row.id }).del()
      return res.status(400).json({ message: 'Code expired' })
    }

    await db('password_resets').where({ user_id: user.id }).del()
    await db('tasks').where({ user_id: user.id }).del()
    await db('settings').where({ user_id: user.id }).del()
    await db('users').where({ id: user.id }).del()

    res.json({ message: 'Account deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message })
  }
})

module.exports = router
