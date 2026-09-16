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
    <div className="container" style={{ maxWidth: 400, marginTop: 100 }}>
      <div className="card">
        <h2 style={{ marginBottom: 24 }}>Forgot password</h2>
        {err && <p style={{ color: 'red', marginBottom: 16 }}>{err}</p>}
        {msg && <p style={{ color: 'green', marginBottom: 16 }}>{msg}</p>}

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
                <input className="input" type="email" value={value} onChange={e => setValue(e.target.value)} required />
              ) : (
                <PhoneInput value={value} onChange={setValue} required />
              )}
            </div>
            <button className="btn" type="submit" style={{ width: '100%' }}>Send code</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verify}>
            <div className="form-group">
              <label>Enter code</label>
              <input className="input" value={code} onChange={e => setCode(e.target.value)} required />
            </div>
            <button className="btn" type="submit" style={{ width: '100%' }}>Verify code</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={reset}>
            <div className="form-group">
              <label>New password</label>
              <input className="input" type="password" value={pw} onChange={e => setPw(e.target.value)} required minLength={6} />
            </div>
            <div className="form-group">
              <label>Confirm password</label>
              <input className="input" type="password" value={pw2} onChange={e => setPw2(e.target.value)} required minLength={6} />
            </div>
            <button className="btn" type="submit" style={{ width: '100%' }}>Reset password</button>
          </form>
        )}

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
