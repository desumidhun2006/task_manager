import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [defaultView, setDefaultView] = useState('monthly')
  const [reminderEmail, setReminderEmail] = useState(true)
  const [saved, setSaved] = useState(false)
  const [deleteStep, setDeleteStep] = useState(0)
  const [deleteCode, setDeleteCode] = useState('')
  const [deleteMsg, setDeleteMsg] = useState('')
  const [deleteErr, setDeleteErr] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/settings')
      setDefaultView(res.data.defaultView || 'monthly')
      setReminderEmail(res.data.reminderEmail ?? true)
    } catch (err) {}
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

  const requestDelete = async () => {
    setDeleteErr('')
    setDeleteMsg('')
    try {
      const res = await api.post('/api/auth/request-delete')
      setDeleteMsg(res.data.message || 'Code sent. Check your email.')
      setDeleteStep(2)
    } catch (e) {
      setDeleteErr(e.response?.data?.message || 'Failed to send code')
    }
  }

  const confirmDelete = async () => {
    setDeleteErr('')
    try {
      await api.post('/api/auth/confirm-delete', { code: deleteCode })
      logout()
      navigate('/login')
    } catch (e) {
      setDeleteErr(e.response?.data?.message || 'Delete failed')
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

        <div className="settings-section" style={{ marginTop: 32, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
          <h3 style={{ color: '#ff4d4d' }}>Danger Zone</h3>
          {deleteStep === 0 && (
            <>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
                Once you delete your account, there is no going back.
              </p>
              <button className="btn btn-danger" onClick={() => setDeleteStep(1)}>Delete Account</button>
            </>
          )}
          {deleteStep === 1 && (
            <>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>
                A verification code will be sent to {user?.email}. Confirm to proceed.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-danger" onClick={requestDelete}>Send Code</button>
                <button className="btn" onClick={() => setDeleteStep(0)}>Cancel</button>
              </div>
            </>
          )}
          {deleteStep === 2 && (
            <>
              {deleteMsg && <div style={{ color: 'var(--success)', fontSize: 13, marginBottom: 8 }}>{deleteMsg}</div>}
              {deleteErr && <div className="auth-error">{deleteErr}</div>}
              <div className="form-group">
                <label>Enter verification code</label>
                <input className="input" value={deleteCode} onChange={e => setDeleteCode(e.target.value)} placeholder="6-digit code" />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-danger" onClick={confirmDelete}>Delete My Account</button>
                <button className="btn" onClick={() => { setDeleteStep(0); setDeleteCode(''); setDeleteMsg(''); setDeleteErr('') }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
