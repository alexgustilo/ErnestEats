const supabase = require('../config/supabase')

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'No valid token provided' })
  }

  const token = authHeader.slice(7).trim()

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = data.user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Could not verify token' })
  }
}

module.exports = requireAuth