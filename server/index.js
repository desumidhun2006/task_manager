require('dotenv').config()
const express = require('express')
const cors = require('cors')
const knex = require('knex')
const config = require('./knexfile')
const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/tasks')
const settingsRoutes = require('./routes/settings')

const environment = process.env.DATABASE_URL ? 'production' : 'development'
const db = knex(config[environment])

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/settings', settingsRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

db.migrate.latest().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
  })
}).catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
