import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const features = [
  { icon: '📅', title: 'Smart Calendar', desc: 'Monthly, weekly & daily views with drag-and-drop task management.' },
  { icon: '🔔', title: 'Reminders', desc: 'Email reminders before events so you never miss a deadline.' },
  { icon: '⚡', title: 'Quick Add', desc: 'Create tasks in seconds with our instant sidebar composer.' },
  { icon: '🎨', title: 'Dark Mode', desc: "Beautiful glassmorphism UI that's easy on your eyes." },
  { icon: '🔒', title: 'Secure', desc: 'JWT auth, encrypted passwords, and privacy-first design.' },
  { icon: '📱', title: 'Responsive', desc: 'Works seamlessly on desktop, tablet, and mobile devices.' },
]

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '50K+', label: 'Tasks Created' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'Rating' },
]

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveFeature(i => (i + 1) % features.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            <span className="logo-icon">TF</span>
            <span className="logo-text">TaskFlow</span>
          </Link>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#stats">Stats</a>
            <a href="#cta">Get Started</a>
          </div>
          <div className="landing-nav-auth">
            <Link to="/login" className="btn btn-ghost">Log In</Link>
            <Link to="/signup" className="btn">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-blobs">
          <div className="hero-blob blob-1" />
          <div className="hero-blob blob-2" />
          <div className="hero-blob blob-3" />
        </div>
        <div className="landing-hero-content">
          <div className="hero-badge">🚀 Now in Beta</div>
          <h1 className="hero-title">
            Manage Your Tasks<br />
            <span className="hero-accent">Like Never Before</span>
          </h1>
          <p className="hero-sub">
            A premium task manager with smart calendar, instant reminders,
            and a gorgeous dark interface. Built for productivity nerds.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-lg">Get Started Free</Link>
            <a href="#features" className="btn btn-ghost btn-lg">See Features ↓</a>
          </div>
          <div className="hero-preview">
            <div className="preview-window">
              <div className="preview-bar">
                <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
              </div>
              <div className="preview-content">
                <div className="preview-sidebar">
                  <div className="preview-btn-add">+ ADD</div>
                  <div className="preview-nav-item active">📅 Calendar</div>
                  <div className="preview-nav-item">⚙️ Settings</div>
                </div>
                <div className="preview-main">
                  <div className="preview-header">September 2026</div>
                  <div className="preview-grid">
                    {Array.from({length:12}).map((_,i) => (
                      <div key={i} className={`preview-day ${i===16?'today':''} ${[2,5,8,11].includes(i)?'has-task':''}`}>
                        {i+1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="features">
        <h2 className="section-title">Everything You Need</h2>
        <p className="section-sub">Powerful features wrapped in a beautiful interface</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className={`feature-card ${activeFeature === i ? 'highlighted' : ''}`}
              onMouseEnter={() => setActiveFeature(i)}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="landing-stats" id="stats">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="landing-cta" id="cta">
        <div className="cta-blob" />
        <h2>Ready to Boost Your Productivity?</h2>
        <p>Join thousands of users who manage their tasks smarter.</p>
        <div className="cta-actions">
          <Link to="/signup" className="btn btn-lg">Start for Free</Link>
          <Link to="/login" className="btn btn-ghost btn-lg">Already have an account?</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-icon">TF</span>
            <span>TaskFlow</span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#stats">Stats</a>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
          <div className="footer-copy">© 2026 TaskFlow. Built with ❤️</div>
        </div>
      </footer>
    </div>
  )
}
