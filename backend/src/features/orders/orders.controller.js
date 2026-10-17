const {
  getOrders,
  createOrder: createOrderService,
  updateOrder: updateOrderService,
  deleteOrder: deleteOrderService
} = require('./orders.service')

// get all orders
async function getAllOrders(req, res) {
  try {
    const orders = await getOrders()
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// create order
async function createOrder(req, res) {
  try {
    const { customer_id, items } = req.body

    const order = await createOrderService(customer_id, items)

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// update order
async function updateOrder(req, res) {
  try {
    const { id } = req.params
    const { status, payment_status } = req.body

    const order = await updateOrderService(id, status, payment_status)

    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// delete order
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
  createOrder,
  updateOrder,
  deleteOrder
}