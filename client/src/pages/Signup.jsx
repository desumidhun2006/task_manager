import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [tempToken, setTempToken] = useState('')
  const { signup, verifySignup, setPassword: setPasswordReq } = useAuth()
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      await signup(name, email)
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
      const data = await verifySignup(email, code)
      setTempToken(data.tempToken)
      setMsg('Email verified! Now set your password.')
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
    }
  }

  const handleSetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      await setPasswordReq(tempToken, password)
      navigate('/calendar')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password')
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
          <div className={`step-dot ${step >= 2 ? (step > 2 ? 'done' : (step === 2 ? 'active' : '')) : ''}`} />
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
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
            <button className="btn" type="submit">Continue</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label>Enter code</label>
              <input className="input" value={code} onChange={e => setCode(e.target.value)} required placeholder="6-digit code" />
            </div>
            <button className="btn" type="submit">Verify Email</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSetPassword}>
            <div className="form-group">
              <label>Password</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Min 6 characters" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input className="input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} placeholder="Re-enter password" />
            </div>
            <button className="btn" type="submit">Create Account</button>
          </form>
        )}

        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  )
}
