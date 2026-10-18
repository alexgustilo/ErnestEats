const {
  getOrders,
  getOrdersByCustomer,
  createOrder: createOrderService,
  updateOrder: updateOrderService,
  deleteOrder: deleteOrderService
} = require('./orders.service')

const {
  createNotification
} = require('../notifications/notifications.service')

const {
  createSale: createSaleService
} = require('../sales/sales.service')

// Get all orders
async function getAllOrders(req, res) {
  try {
    const orders = await getOrders()
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get orders belonging to the signed-in customer
async function getMyOrders(req, res) {
  try {
    const orders = await getOrdersByCustomer(req.user.id)
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create an order for the signed-in customer
async function createOrder(req, res) {
  try {
    const { items } = req.body
    const order = await createOrderService(req.user.id, items)

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update order and create notification or sale when applicable
async function updateOrder(req, res) {
  try {
    const { id } = req.params
    const { status, payment_status } = req.body

    const order = await updateOrderService(id, status, payment_status)

    let sale = null

    if (order.status === 'completed' && order.payment_status === 'paid') {
      sale = await createSaleService(order.id)
    }

    const messageParts = []

    if (status !== undefined) {
      messageParts.push(`Order status updated to ${status}.`)
    }

    if (payment_status !== undefined) {
      messageParts.push(`Payment status updated to ${payment_status}.`)
    }

    const message = messageParts.join(' ')

    await createNotification(order.customer_id, order.id, message)

    res.status(200).json({
      order,
      sale
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Cancel order
async function deleteOrder(req, res) {
  try {
    const { id } = req.params
    const order = await deleteOrderService(id)

    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllOrders,
  getMyOrders,
  createOrder,
  updateOrder,
  deleteOrder
}