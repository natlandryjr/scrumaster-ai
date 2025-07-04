import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import RoleDashboard from './RoleDashboard'
import { FaRobot, FaUserShield, FaChartLine, FaExclamationTriangle, FaUsers, FaCalendarAlt } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import { TerminologyProvider, useTerminology, TERMINOLOGY_MODES } from './terminologyContext.jsx'
import TerminologyToggle from './TerminologyToggle.jsx'
import { useTranslate } from './translate.jsx'

const FEATURES = [
  { icon: <FaRobot size={32} color="#2196f3" />, title: 'AI Planning Assistant', desc: 'Automate PI, sprint, and backlog planning with AI-driven insights.' },
  { icon: <FaUserShield size={32} color="#2196f3" />, title: 'Role-Based Dashboards', desc: 'Custom views for RTEs, Scrum Masters, Product Owners, and Sponsors.' },
  { icon: <FaExclamationTriangle size={32} color="#2196f3" />, title: 'ROAM Risk Tracking', desc: 'Visualize, manage, and mitigate program risks in real time.' },
  { icon: <FaChartLine size={32} color="#2196f3" />, title: 'Real-Time Metrics', desc: 'Track velocity, predictability, and team health instantly.' },
  { icon: <FaUsers size={32} color="#2196f3" />, title: 'Team Collaboration', desc: 'Foster team communication with integrated retrospectives and feedback tools.' },
  { icon: <FaCalendarAlt size={32} color="#2196f3" />, title: 'Sprint Management', desc: 'Streamline sprint planning, execution, and review processes with smart automation.' }
]

const PRICING = [
  { tier: 'Starter', price: 'Free', features: ['1 Team', 'Basic AI Planning', 'Community Support'], cta: 'Get Started' },
  { tier: 'Pro', price: '$12/mo', features: ['Up to 5 Teams', 'Advanced AI', 'Role Dashboards', 'Priority Support'], cta: 'Start Pro Trial' },
  { tier: 'Enterprise', price: 'Contact Us', features: ['Unlimited Teams', 'Custom Integrations', 'Dedicated Success Manager'], cta: 'Contact Sales' }
]

const COMPANY = {
  mission: 'Empowering agile teams to deliver more with less friction, using the power of AI and modern SAFe practices.',
  contact: 'hello@scrumaster.ai'
}

function LandingContent() {
  const translate = useTranslate()
  const [showLogin, setShowLogin] = useState(false)
  const { mode } = useTerminology()

  // Define background images for each mode
  const bgImage = mode === TERMINOLOGY_MODES.HUDDLE
    ? '/huddle_bkgd.png' // creative, energetic, football-inspired but abstract for software
    : '/agile_bkgd.png' // modern, tech, agile/scrum abstract

  // Wrap features and pricing with translated terms
  const features = [
    { icon: <FaRobot size={32} color="#2196f3" />, title: translate('AI Planning Assistant'), desc: translate('Automate PI, sprint, and backlog planning with AI-driven insights.') },
    { icon: <FaUserShield size={32} color="#2196f3" />, title: translate('Role-Based Dashboards'), desc: translate('Custom views for RTEs, Scrum Masters, Product Owners, and Sponsors.') },
    { icon: <FaExclamationTriangle size={32} color="#2196f3" />, title: translate('ROAM Risk Tracking'), desc: translate('Visualize, manage, and mitigate program risks in real time.') },
    { icon: <FaChartLine size={32} color="#2196f3" />, title: translate('Real-Time Metrics'), desc: translate('Track velocity, predictability, and team health instantly.') },
    { icon: <FaUsers size={32} color="#2196f3" />, title: translate('Team Collaboration'), desc: translate('Foster team communication with integrated retrospectives and feedback tools.') },
    { icon: <FaCalendarAlt size={32} color="#2196f3" />, title: translate('Sprint Management'), desc: translate('Streamline sprint planning, execution, and review processes with smart automation.') }
  ]

  const pricing = [
    { tier: translate('Starter'), price: 'Free', features: [translate('1 Team'), translate('Basic AI Planning'), translate('Community Support')], cta: translate('Get Started') },
    { tier: translate('Pro'), price: '$49/mo', features: [translate('Up to 5 Teams'), translate('Advanced AI'), translate('Role Dashboards'), translate('Priority Support')], cta: translate('Start Pro Trial') },
    { tier: translate('Enterprise'), price: translate('Contact Us'), features: [translate('Unlimited Teams'), translate('Custom Integrations'), translate('Dedicated Success Manager')], cta: translate('Contact Sales') }
  ]

  return (
    <div className="landing-root">
      <header className="sticky-header" style={{ backgroundColor: '#111111' }}>
        <img src="/scrumaster_ai_logo.png" alt="Scrumaster AI Logo" className="nav-logo" />
        <nav>
          <TerminologyToggle />
          <button className="nav-btn" onClick={() => setShowLogin(true)}>{translate('Login')}</button>
          <button className="nav-btn primary" onClick={() => setShowLogin(true)}>{translate('Start Free Trial')}</button>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">{translate('AI-Powered Agile for SAFe, Scrum & Hybrid Teams')}</h1>
            <p className="hero-subtitle">{translate('Built for RTEs, Scrum Masters, Product Owners & Sponsors')}</p>
            <p className="hero-description">
              Streamline your agile processes with intelligent automation, real-time insights, and role-based dashboards designed for modern software teams.
            </p>
            <div className="hero-cta">
              <button className="cta-btn primary" onClick={() => setShowLogin(true)}>
                {translate('Start Free Trial')}
              </button>
              <button className="cta-btn secondary" onClick={() => setShowLogin(true)}>
                {translate('Login')}
              </button>
            </div>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-card">
              <div className="card-header">
                <div className="card-avatar">🤖</div>
                <div className="card-info">
                  <h3>AI Assistant</h3>
                  <p>Ready to help</p>
                </div>
              </div>
              <div className="card-content">
                <div className="metric">
                  <span className="metric-value">87%</span>
                  <span className="metric-label">Faster Planning</span>
                </div>
                <div className="metric">
                  <span className="metric-value">24/7</span>
                  <span className="metric-label">Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="modes-edu-section">
        <h3 className="section-title">How Scrumaster AI Works: Two Modes for Every Team</h3>
        <div className="modes-edu-content">
          <p><strong>Agile/Scrum Mode:</strong> Use industry-standard Agile and Scrum terminology for a classic, professional experience.</p>
          <p><strong>Huddle Method Mode:</strong> Instantly switch to a fun, motivational overlay inspired by American football—perfect for energizing your software team, not just sports fans! All Agile terms are mapped to "Huddle" lingo, making ceremonies and metrics more engaging while keeping the process 100% software-focused.</p>
          <p>Switch between modes anytime using the toggle in the header. No matter which you choose, all features and workflows remain the same—just the vocabulary changes!</p>
        </div>
      </section>

      <section className="features-section compact-section">
        <h3 className="section-title">{translate('Key Features')}</h3>
        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div className="feature-card" key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pricing-section compact-section">
        <h3 className="section-title">{translate('Pricing')}</h3>
        <div className="pricing-grid">
          {pricing.map((p, i) => (
            <motion.div className="pricing-card" key={p.tier} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
              <div className="pricing-tier">{p.tier}</div>
              <div className="pricing-price">{p.price}</div>
              <ul className="pricing-features">
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <button className="pricing-cta" onClick={() => setShowLogin(true)}>{p.cta}</button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="about-section compact-section">
        <h3 className="section-title">{translate('About Us')}</h3>
        <motion.div className="about-content" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
          <p className="about-mission">{translate(COMPANY.mission)}</p>
          <p className="about-contact">{translate('Contact')}: <a href={`mailto:${COMPANY.contact}`}>{COMPANY.contact}</a></p>
        </motion.div>
      </section>

      <AnimatePresence>
        {showLogin && (
          <motion.div className="login-modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="login-modal" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <button className="close-modal" onClick={() => setShowLogin(false)}>&times;</button>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa, variables: { default: { colors: { brand: '#2196f3', brandAccent: '#1565c0' } } } }}
                providers={['google']}
                theme="light"
                onSuccess={(session) => {
                  console.log('Login successful:', session)
                  setShowLogin(false)
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="nlcs-footer">
        <a href="https://nlcs-inc.com" target="_blank" rel="noopener noreferrer">a NLCS SaaS</a>
      </footer>
    </div>
  )
}

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getOrCreateUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const authUser = session?.user

        if (authUser) {
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', authUser.id)
            .maybeSingle()

          if (error) {
            console.error('Error fetching user profile:', error.message)
          }

          if (profile) {
            setUser(profile)
          } else {
            // Auto-create user if not found
            const { data: insertedUser, error: insertError } = await supabase
              .from('users')
              .insert({
                auth_id: authUser.id,
                email: authUser.email,
                full_name: authUser.user_metadata?.full_name || authUser.email,
                roles: ['Scrum Master'] // default role
              })
              .select()
              .single()

            if (insertError) {
              console.error('Error creating user profile:', insertError.message)
            } else {
              setUser(insertedUser)
            }
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error in getOrCreateUserProfile:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getOrCreateUserProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)

      if (event === 'SIGNED_IN' && session?.user) {
        await getOrCreateUserProfile()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7fafd',
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <TerminologyProvider>
      {user ? <RoleDashboard userId={user.id} /> : <LandingContent />}
    </TerminologyProvider>
  )
}

export default App
