const supabase = require('../../config/supabase')

// get orders with their order items
async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// create order and deduct inventory
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
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()

  if (orderError) {
    throw orderError
  }

  return order
}

// update order status or payment status
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
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()

  if (orderError) {
    throw orderError
  }

  return order
}

// cancel order and restore inventory
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
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()

  if (orderError) {
    throw orderError
  }

  return order
}

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder
}