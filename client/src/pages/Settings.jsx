import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Settings() {
  const { user } = useAuth()
  const [defaultView, setDefaultView] = useState('monthly')
  const [reminderEmail, setReminderEmail] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/settings')
      setDefaultView(res.data.defaultView || 'monthly')
      setReminderEmail(res.data.reminderEmail ?? true)
    } catch (err) {
      // use defaults
    }
  }

  const handleSave = async () => {
    try {
      await api.put('/api/settings', { defaultView, reminderEmail })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save settings')
    }
  }

  return (
    <div className="app-layout">
      <main className="main-content" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="page-header">
          <h2>Settings</h2>
          <Link to="/calendar">← Calendar</Link>
        </div>

        <div className="settings-section">
          <h3>Calendar</h3>
          <div className="form-group">
            <label>Default View</label>
            <select className="input" value={defaultView} onChange={e => setDefaultView(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Reminders</h3>
          <div className="settings-row">
            <div>
              <label>Email Reminders</label>
              <div className="label-sub">{user?.email || 'No email set'}</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={reminderEmail} onChange={e => setReminderEmail(e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        <button className="btn" onClick={handleSave} style={{ marginTop: 8 }}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </main>
    </div>
  )
}
