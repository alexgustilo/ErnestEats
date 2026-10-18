const {
  getNotifications: getNotificationsService,
  createNotification: createNotificationService,
  markNotificationAsRead: markNotificationAsReadService
} = require('./notifications.service')

// Get notifications for the signed-in customer
async function getMyNotifications(req, res) {
  try {
    const notifications = await getNotificationsService(req.user.id)
    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create a notification
async function createNotification(req, res) {
  try {
    const { customer_id, order_id, message } = req.body

    const notification = await createNotificationService(
      customer_id,
      order_id,
      message
    )

    res.status(201).json(notification)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Mark the signed-in customer's notification as read
async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params
    const notification = await markNotificationAsReadService(id, req.user.id)

    res.status(200).json(notification)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getMyNotifications,
  createNotification,
  markNotificationAsRead
}