const express = require('express')
const router = express.Router()
const requireAuth = require('../../middleware/auth.middleware')
const { getMyProfile, updateMyProfile } = require('./profile.controller')

router.get('/me', requireAuth, getMyProfile)
router.put('/me', requireAuth, updateMyProfile)

module.exports = router
