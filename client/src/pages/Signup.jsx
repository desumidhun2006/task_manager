import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const { signup, verifySignup } = useAuth()
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      await signup(name, email, password)
      setMsg('Code sent. Check your email.')
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await verifySignup(email, code)
      navigate('/calendar')
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-card">
        <Link to="/" className="auth-back">← Back</Link>
        <h2>Create account</h2>
        <p className="auth-subtitle">Start managing your tasks smarter</p>

        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`} />
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
        </div>

        {error && <div className="auth-error">{error}</div>}
        {msg && <div style={{ color: 'var(--success)', fontSize: 13, marginBottom: 16 }}>{msg}</div>}

        {step === 1 && (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Name</label>
              <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Min 6 characters" />
            </div>
            <button className="btn" type="submit">Create Account</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label>Enter code</label>
              <input className="input" value={code} onChange={e => setCode(e.target.value)} required placeholder="6-digit code" />
            </div>
            <button className="btn" type="submit">Verify & Complete</button>
          </form>
        )}

        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  )
}
