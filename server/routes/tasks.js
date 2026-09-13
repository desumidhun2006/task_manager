const express = require('express')
const auth = require('../middleware/auth')
const db = require('../db')

const router = express.Router()

router.use(auth)

router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query
    const tasks = await db('tasks')
      .where('user_id', req.user.id)
      .whereBetween('start_time', [start, end])
      .orderBy('start_time')
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, description, start_time, end_time, reminder } = req.body
    const [task] = await db('tasks')
      .insert({
        user_id: req.user.id,
        title,
        description,
        start_time,
        end_time,
        reminder
      })
      .returning('*')
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { title, description, start_time, end_time, reminder } = req.body
    const [task] = await db('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .update({ title, description, start_time, end_time, reminder, updated_at: new Date() })
      .returning('*')
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await db('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .del()
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task' })
  }
})

module.exports = router
