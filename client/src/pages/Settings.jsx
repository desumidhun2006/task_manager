import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Settings() {
  const { user } = useAuth()
  const [defaultView, setDefaultView] = useState('monthly')
  const [reminderSMS, setReminderSMS] = useState(true)
  const [reminderEmail, setReminderEmail] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/settings')
      setDefaultView(res.data.defaultView || 'monthly')
      setReminderSMS(res.data.reminderSMS ?? true)
      setReminderEmail(res.data.reminderEmail ?? true)
    } catch (err) {
      // use defaults
    }
  }

  const handleSave = async () => {
    try {
      await axios.put('/api/settings', { defaultView, reminderSMS, reminderEmail })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save settings')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="page-header">
        <h2>Settings</h2>
        <Link to="/calendar">Back to Calendar</Link>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Calendar</h3>
        <div className="form-group">
          <label>Default View</label>
          <select className="input" value={defaultView} onChange={e => setDefaultView(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        <h3 style={{ marginBottom: 16, marginTop: 24 }}>Reminders</h3>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={reminderSMS} onChange={e => setReminderSMS(e.target.checked)} />
            SMS Reminders ({user?.phone || 'no phone set'})
          </label>
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={reminderEmail} onChange={e => setReminderEmail(e.target.checked)} />
            Email Reminders ({user?.email || 'no email set'})
          </label>
        </div>

        <button className="btn" onClick={handleSave} style={{ marginTop: 16 }}>
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
