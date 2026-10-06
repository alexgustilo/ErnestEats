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


// create order with order items
async function createOrder(customer_id, items) {
    if (!customer_id) {
        throw new Error('customer_id is required')
    }

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('At least one order item is required')
    }

    for (const item of items) {
        if (!item.product_id) {
            throw new Error('Each item must have a product_id')
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error('Each item must have a positive whole-number quantity')
        }
    }

    const productIds = [...new Set(items.map((item) => item.product_id))]

    const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, price, is_available')
    .in('id', productIds)

    if (productsError) {
        throw productsError
    }

    const orderItems = items.map((item) => {
        const product = products.find((product) => product.id === item.product_id)

    if (!product) {
        throw new Error(`Product ${item.product_id} was not found`)
    }

    if (!product.is_available) {
        throw new Error(`Product ${item.product_id} is not available`)
    }

    const price = Number(product.price)

    if (!Number.isFinite(price) || price < 0) {
        throw new Error(`Product ${item.product_id} has an invalid price`)
    }

    return {
        product_id: product.id,
        quantity: item.quantity,
    price
        }
    })

    const totalAmountInCents = orderItems.reduce((total, item) => {
        return total + Math.round(item.price * 100) * item.quantity
    }, 0)

    const total_amount = (totalAmountInCents / 100).toFixed(2)

    const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
        customer_id: customer_id,
        status: 'pending',
        total_amount: total_amount,
        payment_status: 'unpaid'
    })
    .select()
    .single()

    if (orderError) {
        throw orderError
    }

    const itemsToSave = orderItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
    }))

    const { data: savedItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToSave)
    .select()

    if (itemsError) {
        throw itemsError
    }

    return {
    ...order,
    order_items: savedItems
    }
}


// update order status or payment status
async function updateOrder(id, status, payment_status) {
    const updates = {}

    if (status !== undefined) {
        updates.status = status
    }

    if (payment_status !== undefined) {
        updates.payment_status = payment_status
    }

    if (Object.keys(updates).length === 0) {
        throw new Error('Provide a status or payment_status to update')
    }

    const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select('*, order_items(*)')
    .single()

    if (error) {
        throw error
    }

    return data
}



// delete order
async function deleteOrder(id) {
    const { data, error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)
    .select()
    .single()

    if (error) {
        throw error
    }

    return data
}

module.exports = {
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder
}