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
  // Keep products and inventory intact; removing a category only clears the
  // category association so the products remain available as uncategorized.
  const { error: productsError } = await supabase
    .from('products')
    .update({ category_id: null })
    .eq('category_id', id)

  if (productsError) {
    throw productsError
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
