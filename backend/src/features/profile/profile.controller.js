const { getProfile, getCustomerProfiles, updateProfile } = require('./profile.service')

async function getAllCustomerProfiles(req, res) {
  try {
    res.status(200).json(await getCustomerProfiles())
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

async function getMyProfile(req, res) {
  try {
    res.status(200).json({ ...(await getProfile(req.user.id)), email: req.user.email })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

async function updateMyProfile(req, res) {
  try {
    const { full_name, contact_number } = req.body
    if (full_name !== undefined && !String(full_name).trim()) {
      return res.status(400).json({ error: 'Full name cannot be empty' })
    }
    const profile = await updateProfile(req.user.id, {
      ...(full_name !== undefined ? { full_name: String(full_name).trim() } : {}),
      ...(contact_number !== undefined ? { contact_number: String(contact_number).trim() } : {})
    })
    res.status(200).json({ ...profile, email: req.user.email })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAllCustomerProfiles, getMyProfile, updateMyProfile }
