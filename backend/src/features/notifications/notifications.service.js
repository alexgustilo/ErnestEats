const supabase = require('../../config/supabase')

// get notifications for one customer
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

// create notification
async function createNotification(customer_id, order_id, message) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      customer_id: customer_id,
      order_id: order_id,
      message: message,
      is_read: false
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// mark notification as read
async function markNotificationAsRead(id) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
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