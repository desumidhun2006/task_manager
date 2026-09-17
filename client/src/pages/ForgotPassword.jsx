import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import PhoneInput from '../components/PhoneInput'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState('email')
  const [value, setValue] = useState('')
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
      await api.post('/api/auth/forgot-password', { method, value })
      setMsg('Code sent. Check your email/SMS.')
      setStep(2)
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Send failed')
    }
  }

  const verify = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      await api.post('/api/auth/verify-code', { method, value, code })
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
      await api.post('/api/auth/reset-password', { method, value, code, newPassword: pw })
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
        <p className="auth-subtitle">We'll send a code to verify your identity</p>

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
              <label>Send code via</label>
              <select className="input" value={method} onChange={e => { setMethod(e.target.value); setValue('') }}>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            <div className="form-group">
              <label>{method === 'email' ? 'Email' : 'Phone'}</label>
              {method === 'email' ? (
                <input className="input" type="email" value={value} onChange={e => setValue(e.target.value)} required placeholder="you@example.com" />
              ) : (
                <PhoneInput value={value} onChange={setValue} required />
              )}
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
