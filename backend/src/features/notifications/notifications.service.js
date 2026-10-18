const supabase = require('../../config/supabase')

// Get notifications for one customer
async function getNotifications(customer_id) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('customer_id', customer_id)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// Create a notification
async function createNotification(customer_id, order_id, message) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      customer_id,
      order_id,
      message,
      is_read: false
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Mark only this customer's notification as read
async function markNotificationAsRead(id, customer_id) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('customer_id', customer_id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

module.exports = {
  getNotifications,
  createNotification,
  markNotificationAsRead
}