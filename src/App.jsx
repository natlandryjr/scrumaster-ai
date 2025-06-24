import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import RoleDashboard from './RoleDashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      setUser(data?.user ?? null)
      setLoading(false)
    }
    getUser()
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  if (loading) return <div>Loading...</div>
  if (user) return <RoleDashboard userId={user.id} />

  return (
    <div className="home-container">
      <div className="glass-card">
        <div className="logo-wrap">
          <img src="/scrumaster_ai_logo.png" alt="Scrumaster AI Logo" className="app-logo" />
        </div>
        <h1 className="tagline">AI-Powered Agile for SAFe, Scrum & Hybrid Teams</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa, variables: { default: { colors: { brand: '#2196f3', brandAccent: '#1565c0' } } } }}
          providers={['google']}
          theme="light"
        />
      </div>
    </div>
  )
}

export default App
