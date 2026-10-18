const supabase = require('../../config/supabase')

async function getProfile(id) {
  const { data, error } = await supabase.from('profiles').select('id, full_name, contact_number, role').eq('id', id).single()
  if (error) throw error
  return data
}

async function updateProfile(id, updates) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select('id, full_name, contact_number, role').single()
  if (error) throw error
  return data
}

module.exports = { getProfile, updateProfile }
