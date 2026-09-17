import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  const send = async (e) => {
    e.preventDefault()
    setErr('')
    setMsg('')
    try {
      await api.post('/api/auth/forgot-password', { email })
      setMsg('Code sent. Check your email.')
      setStep(2)
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Send failed')
    }
  }

  const verify = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      await api.post('/api/auth/verify-code', { email, code })
      setMsg('Code verified. Set new password.')
      setStep(3)
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Invalid code')
    }
  }

  const reset = async (e) => {
    e.preventDefault()
    setErr('')
    if (pw !== pw2) return setErr('Passwords do not match')
    try {
      await api.post('/api/auth/reset-password', { email, code, newPassword: pw })
      setMsg('Password reset. Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Reset failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-card">
        <h2>Reset password</h2>
        <p className="auth-subtitle">We'll send a code to your email</p>

        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`} />
          <div className={`step-dot ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`} />
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
        </div>

        {err && <div className="auth-error">{err}</div>}
        {msg && <div style={{ color: 'var(--success)', fontSize: 13, marginBottom: 16 }}>{msg}</div>}

        {step === 1 && (
          <form onSubmit={send}>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <button className="btn" type="submit">Send Code</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verify}>
            <div className="form-group">
              <label>Enter code</label>
              <input className="input" value={code} onChange={e => setCode(e.target.value)} required placeholder="6-digit code" />
            </div>
            <button className="btn" type="submit">Verify Code</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={reset}>
            <div className="form-group">
              <label>New password</label>
              <input className="input" type="password" value={pw} onChange={e => setPw(e.target.value)} required minLength={6} placeholder="Min 6 characters" />
            </div>
            <div className="form-group">
              <label>Confirm password</label>
              <input className="input" type="password" value={pw2} onChange={e => setPw2(e.target.value)} required minLength={6} placeholder="Repeat password" />
            </div>
            <button className="btn" type="submit">Reset Password</button>
          </form>
        )}

        <p><Link to="/login">← Back to login</Link></p>
      </div>
    </div>
  )
}
