const express = require('express')
const router = express.Router()

const {
  getCustomerNotifications,
  createNotification,
  markNotificationAsRead
} = require('./notifications.controller')

router.get('/customer/:customer_id', getCustomerNotifications)
router.post('/', createNotification)
router.patch('/:id/read', markNotificationAsRead)

module.exports = router