const {
  getNotifications: getNotificationsService,
  createNotification: createNotificationService,
  markNotificationAsRead: markNotificationAsReadService
} = require('./notifications.service')

// get notifications for one customer
async function getCustomerNotifications(req, res) {
  try {
    const { customer_id } = req.params
    const notifications = await getNotificationsService(customer_id)

    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// create notification
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

// mark notification as read
async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params
    const notification = await markNotificationAsReadService(id)

    res.status(200).json(notification)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getCustomerNotifications,
  createNotification,
  markNotificationAsRead
}