const supabase = require('../../config/supabase')

// Get all orders with their order items
async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name))')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// Get orders belonging to one customer
async function getOrdersByCustomer(customerId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name))')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// Create order and deduct inventory
async function createOrder(customer_id, items) {
  const { data: orderId, error: createError } = await supabase.rpc(
    'place_order_with_inventory',
    {
      p_customer_id: customer_id,
      p_items: items
    }
  )

  if (createError) {
    throw createError
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name))')
    .eq('id', orderId)
    .single()

  if (orderError) {
    throw orderError
  }

  return order
}

// Update order status or payment status
async function updateOrder(id, status, payment_status) {
  const { data: orderId, error: updateError } = await supabase.rpc(
    'update_order_with_stock',
    {
      p_order_id: id,
      p_status: status ?? null,
      p_payment_status: payment_status ?? null
    }
  )

  if (updateError) {
    throw updateError
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name))')
    .eq('id', orderId)
    .single()

  if (orderError) {
    throw orderError
  }

  return order
}

// Cancel order and restore inventory
async function deleteOrder(id) {
  const { data: orderId, error: cancelError } = await supabase.rpc(
    'update_order_with_stock',
    {
      p_order_id: id,
      p_status: 'cancelled',
      p_payment_status: null
    }
  )

  if (cancelError) {
    throw cancelError
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name))')
    .eq('id', orderId)
    .single()

  if (orderError) {
    throw orderError
  }

  return order
}

module.exports = {
  getOrders,
  getOrdersByCustomer,
  createOrder,
  updateOrder,
  deleteOrder
}