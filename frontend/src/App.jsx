import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [status, setStatus] = useState('Testing connection...')

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setStatus('Error: ' + error.message)
      else setStatus('Connected to Supabase!')
    })
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>{status}</h1>
    </div>
  )
}

export default App;