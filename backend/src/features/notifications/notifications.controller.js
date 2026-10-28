const {
  getNotifications: getNotificationsService,
  createNotification: createNotificationService,
  markNotificationAsRead: markNotificationAsReadService,
  addNotificationListener
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

// Stream new notifications to only the authenticated customer's browser.
function streamMyNotifications(req, res) {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  })
  res.flushHeaders?.()
  res.write('event: connected\ndata: {}\n\n')

  const removeListener = addNotificationListener(req.user.id, (notification) => {
    res.write(`event: notification\ndata: ${JSON.stringify(notification)}\n\n`)
  })
  const heartbeat = setInterval(() => res.write(': keep-alive\n\n'), 25_000)

  res.on('close', () => {
    clearInterval(heartbeat)
    removeListener()
  })
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
  streamMyNotifications,
  createNotification,
  markNotificationAsRead
}
