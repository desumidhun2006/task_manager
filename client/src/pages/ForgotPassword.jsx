import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function ForgotPassword() {
  const [method, setMethod] = useState('email')
  const [value, setValue] = useState('')
  const [code, setCode] = useState('')
  const [pw, setPw] = useState('')
  const [sent, setSent] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  const send = async (e) => {
    e.preventDefault()
    setErr('')
    setMsg('')
    try {
      const r = await api.post('/api/auth/forgot-password', { method, value })
      setSent(true)
      setMsg(r.data.debugCode ? `Code sent. Dev code: ${r.data.debugCode}` : 'Code sent. Check email/SMS.')
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Send failed')
    }
  }

  const reset = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const r = await api.post('/api/auth/reset-password', { method, value, code, newPassword: pw })
      setMsg(r.data.message)
      setTimeout(() => navigate('/login'), 1200)
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
        {!sent ? (
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
              <input className="input" type={method === 'email' ? 'email' : 'tel'} value={value} onChange={e => setValue(e.target.value)} required />
            </div>
            <button className="btn" type="submit" style={{ width: '100%' }}>Send code</button>
          </form>
        ) : (
          <form onSubmit={reset}>
            <div className="form-group">
              <label>Code</label>
              <input className="input" value={code} onChange={e => setCode(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>New password</label>
              <input className="input" type="password" value={pw} onChange={e => setPw(e.target.value)} required minLength={6} />
            </div>
            <button className="btn" type="submit" style={{ width: '100%' }}>Reset</button>
          </form>
        )}
        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
