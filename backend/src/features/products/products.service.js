const supabase = require('../../config/supabase')
const { uploadProductImage, removeProductImage } = require('./productImages.service')

async function getProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')

  if (error) throw error

  const { data: inventory, error: inventoryError } = await supabase
    .from('inventory')
    .select('product_id, stock_quantity')

  if (inventoryError) throw inventoryError

  const stockByProductId = new Map(
    inventory.map((item) => [String(item.product_id), Number(item.stock_quantity) || 0])
  )

  return products.map((product) => ({
    ...product,
    stock_quantity: stockByProductId.get(String(product.id)) ?? 0
  }))
}

async function createProduct(product, imageFile) {
  const { stock_quantity: stockQuantity = 0, ...productFields } = product
  const uploadedImage = await uploadProductImage(imageFile)
  const { data: createdProduct, error: productError } = await supabase
    .from('products')
    .insert({ ...productFields, image_url: uploadedImage?.url || null })
    .select()
    .single()

  if (productError) {
    if (uploadedImage) await removeProductImage(uploadedImage.url)
    throw productError
  }

  const { data: inventory, error: inventoryError } = await supabase
    .from('inventory')
    .insert({
      product_id: createdProduct.id,
      stock_quantity: stockQuantity,
      low_stock_threshold: 5
    })
    .select('stock_quantity')
    .single()

  if (inventoryError) {
    const { error: rollbackError } = await supabase
      .from('products')
      .delete()
      .eq('id', createdProduct.id)

    if (uploadedImage) {
      try {
        await removeProductImage(uploadedImage.url)
      } catch {
        // Preserve the inventory error; image cleanup can be retried separately.
      }
    }

    if (rollbackError) {
      inventoryError.message = `Could not save starting stock, and the new product could not be rolled back: ${inventoryError.message}`
    }
    throw inventoryError
  }

  return { ...createdProduct, stock_quantity: inventory.stock_quantity }
}

async function updateProduct(id, product, imageFile) {
  const { data: existingProduct, error: findError } = await supabase
    .from('products')
    .select('id, image_url')
    .eq('id', id)
    .single()

  if (findError) {
    if (findError.code === 'PGRST116') {
      const notFound = new Error('Product not found.')
      notFound.statusCode = 404
      throw notFound
    }
    throw findError
  }

  const uploadedImage = await uploadProductImage(imageFile)
  const updates = { ...product }
  if (uploadedImage) updates.image_url = uploadedImage.url

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (uploadedImage) await removeProductImage(uploadedImage.url)
    throw error
  }

  if (uploadedImage && existingProduct.image_url) {
    await removeProductImage(existingProduct.image_url)
  }

  return data
}

async function deleteProduct(id) {
  const { data: existingProduct, error: findError } = await supabase
    .from('products')
    .select('id, image_url')
    .eq('id', id)
    .single()

  if (findError) {
    if (findError.code === 'PGRST116') {
      const notFound = new Error('Product not found.')
      notFound.statusCode = 404
      throw notFound
    }
    throw findError
  }

  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  await removeProductImage(existingProduct.image_url)
  return data
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct }
