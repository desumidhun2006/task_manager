const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    const existing = await db('users').where({ email }).first()
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const password_hash = await bcrypt.hash(password, 10)
    const [user] = await db('users')
      .insert({ name, email, phone, password_hash })
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

module.exports = router
