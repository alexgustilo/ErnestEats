const supabase = require('../../config/supabase')

// Get categories
async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')

  if (error) {
    throw error
  }

  return data
}

// Create a category
async function createCategory(name) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Update a category
async function updateCategory(id, name) {
  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Delete a category and leave its products uncategorized
async function deleteCategory(id) {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id')
    .eq('category_id', id)

  if (productsError) {
    throw productsError
  }

  const productIds = products.map((product) => product.id)

  if (productIds.length > 0) {
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('product_id')
      .in('product_id', productIds)
      .limit(1)

    if (orderItemsError) {
      throw orderItemsError
    }

    if (orderItems.length > 0) {
      throw new Error(
        'Cannot delete this category because one or more products are used in existing orders.'
      )
    }

    const { error: inventoryError } = await supabase
      .from('inventory')
      .delete()
      .in('product_id', productIds)

    if (inventoryError) {
      throw inventoryError
    }

    const { error: deleteProductsError } = await supabase
      .from('products')
      .delete()
      .in('id', productIds)

    if (deleteProductsError) {
      throw deleteProductsError
    }
  }

  const { data, error } = await supabase
    .from('categories')
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
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
}