const express = require('express')
const router = express.Router()
const requireAuth = require('../../middleware/auth.middleware')
const requireAdmin = require('../../middleware/role.middleware')
const { getAllCustomerProfiles, getMyProfile, updateMyProfile } = require('./profile.controller')

router.get('/customers', requireAuth, requireAdmin, getAllCustomerProfiles)
router.get('/me', requireAuth, getMyProfile)
router.put('/me', requireAuth, updateMyProfile)

module.exports = router
