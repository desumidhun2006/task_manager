const cron = require('node-cron')
const db = require('../db')
const { sendEmail } = require('./email')

const reminderOffsets = {
  '0m': 0,
  '15m': 15 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000
}

async function checkReminders() {
  const now = new Date()

  const tasks = await db('tasks')
    .join('users', 'tasks.user_id', 'users.id')
    .whereNot('tasks.reminder', 'none')
    .where('tasks.start_time', '>', now)

  for (const task of tasks) {
    const offset = reminderOffsets[task.reminder]
    const reminderTime = new Date(task.start_time.getTime() - offset)

    if (now >= reminderTime && now < new Date(reminderTime.getTime() + 60000)) {
      const message = `Reminder: ${task.title} at ${new Date(task.start_time).toLocaleString()}`
      sendEmail(task.email, 'Task Reminder', message)
    }
  }
}

// Run every minute
cron.schedule('* * * * *', checkReminders)

module.exports = { checkReminders }
