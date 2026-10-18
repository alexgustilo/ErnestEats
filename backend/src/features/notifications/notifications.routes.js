const express = require('express')
const router = express.Router()

const requireAuth = require('../../middleware/auth.middleware')
const requireAdmin = require('../../middleware/role.middleware')

const {
  getMyNotifications,
  createNotification,
  markNotificationAsRead
} = require('./notifications.controller')

router.get('/mine', requireAuth, getMyNotifications)
router.post('/', requireAuth, requireAdmin, createNotification)
router.patch('/:id/read', requireAuth, markNotificationAsRead)

module.exports = router