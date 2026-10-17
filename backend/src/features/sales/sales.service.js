const supabase = require('../../config/supabase')

// get sales
async function getSales() {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('sold_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// create sale from a completed and paid order
async function createSale(order_id) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, customer_id, status, total_amount, payment_status')
    .eq('id', order_id)
    .single()

  if (orderError) {
    throw orderError
  }

  if (order.status !== 'completed') {
    throw new Error('Only completed orders can be recorded as sales')
  }

  if (order.payment_status !== 'paid') {
    throw new Error('Only paid orders can be recorded as sales')
  }

  const { data: existingSale, error: existingSaleError } = await supabase
    .from('sales')
    .select('id')
    .eq('order_id', order_id)
    .maybeSingle()

  if (existingSaleError) {
    throw existingSaleError
  }

  if (existingSale) {
    throw new Error('A sale record already exists for this order')
  }

  const { data, error } = await supabase
    .from('sales')
    .insert({
      order_id: order.id,
      customer_id: order.customer_id,
      total_amount: order.total_amount
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

module.exports = {
  getSales,
  createSale
}