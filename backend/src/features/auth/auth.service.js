const supabase = require('../../config/supabase')
const { createClient } = require('@supabase/supabase-js')

function createAuthClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  )
}

async function registerUser({ email, password, fullName, contactNumber }) {
  const authClient = createAuthClient()

  const { data: authData, error: authError } = await authClient.auth.signUp({
    email,
    password
  })

  if (authError) throw new Error(authError.message)

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      full_name: fullName,
      contact_number: contactNumber,
      role: 'customer'
    })
    .select()
    .single()

  if (profileError) throw new Error(profileError.message)

  return {
    user: authData.user,
    profile: profileData
  }
}

async function loginUser({ email, password }) {
  const authClient = createAuthClient()

  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw new Error(error.message)

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (profileError) throw new Error(profileError.message)

  return {
    session: data.session,
    user: data.user,
    profile: profileData
  }
}

module.exports = { registerUser, loginUser }