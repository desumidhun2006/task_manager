const express = require('express')
const auth = require('../middleware/auth')
const db = require('../db')

const router = express.Router()

router.use(auth)

router.get('/', async (req, res) => {
  try {
    let settings = await db('settings').where('user_id', req.user.id).first()
    if (!settings) {
      [settings] = await db('settings')
        .insert({ user_id: req.user.id })
        .returning('*')
    }
    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch settings' })
  }
})

router.put('/', async (req, res) => {
  try {
    const { defaultView, reminderSMS, reminderEmail } = req.body
    let settings = await db('settings').where('user_id', req.user.id).first()
    if (!settings) {
      [settings] = await db('settings')
        .insert({ user_id: req.user.id, default_view: defaultView, reminder_sms: reminderSMS, reminder_email: reminderEmail })
        .returning('*')
    } else {
      [settings] = await db('settings')
        .where('user_id', req.user.id)
        .update({ default_view: defaultView, reminder_sms: reminderSMS, reminder_email: reminderEmail, updated_at: new Date() })
        .returning('*')
    }
    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update settings' })
  }
})

module.exports = router
