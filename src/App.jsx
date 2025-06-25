import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import RoleDashboard from './RoleDashboard'
import { FaRobot, FaUserShield, FaChartLine, FaExclamationTriangle } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const FEATURES = [
  { icon: <FaRobot size={32} color="#2196f3" />, title: 'AI Planning Assistant', desc: 'Automate PI, sprint, and backlog planning with AI-driven insights.' },
  { icon: <FaUserShield size={32} color="#2196f3" />, title: 'Role-Based Dashboards', desc: 'Custom views for RTEs, ScrumMasters, Product Owners, and Sponsors.' },
  { icon: <FaExclamationTriangle size={32} color="#2196f3" />, title: 'ROAM Risk Tracking', desc: 'Visualize, manage, and mitigate program risks in real time.' },
  { icon: <FaChartLine size={32} color="#2196f3" />, title: 'Real-Time Metrics', desc: 'Track velocity, predictability, and team health instantly.' }
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
                roles: ['ScrumMaster'] // default role
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

  if (user) {
    return <RoleDashboard userId={user.id} />
  }

  return (
    <div className="landing-root">
      <header className="sticky-header">
        <img src="/scrumaster_ai_logo.png" alt="Scrumaster AI Logo" className="nav-logo" />
        <nav>
          <button className="nav-btn" onClick={() => setShowLogin(true)}>Login</button>
          <button className="nav-btn primary" onClick={() => setShowLogin(true)}>Start Free Trial</button>
        </nav>
      </header>

      <section className="hero-section">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className="hero-title">AI-Powered Agile for SAFe, Scrum & Hybrid Teams</h1>
          <h2 className="hero-sub">Built for RTEs, ScrumMasters, Product Owners & Sponsors</h2>
          <div className="hero-cta">
            <button className="cta-btn primary" onClick={() => setShowLogin(true)}>Start Free Trial</button>
            <button className="cta-btn" onClick={() => setShowLogin(true)}>Login</button>
          </div>
        </motion.div>
      </section>

      <section className="features-section">
        <h3 className="section-title">Key Features</h3>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <motion.div className="feature-card" key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pricing-section">
        <h3 className="section-title">Pricing</h3>
        <div className="pricing-grid">
          {PRICING.map((p, i) => (
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

      <section className="about-section">
        <h3 className="section-title">About Us</h3>
        <motion.div className="about-content" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
          <p className="about-mission">{COMPANY.mission}</p>
          <p className="about-contact">Contact: <a href={`mailto:${COMPANY.contact}`}>{COMPANY.contact}</a></p>
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
    </div>
  )
}

export default App
