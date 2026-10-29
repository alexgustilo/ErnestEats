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

  const { stock_quantity: stockQuantity, ...productUpdates } = product
  const { data: existingInventory, error: inventoryFindError } = await supabase
    .from('inventory')
    .select('id, stock_quantity, low_stock_threshold')
    .eq('product_id', id)
    .maybeSingle()

  if (inventoryFindError) throw inventoryFindError

  const uploadedImage = await uploadProductImage(imageFile)
  const updates = { ...productUpdates }
  if (uploadedImage) updates.image_url = uploadedImage.url

  let savedInventory = existingInventory
  let inventoryWasUpdated = false
  if (stockQuantity !== undefined) {
    const inventoryResult = existingInventory
      ? await supabase
        .from('inventory')
        .update({ stock_quantity: stockQuantity })
        .eq('id', existingInventory.id)
        .select('id, stock_quantity, low_stock_threshold')
        .single()
      : await supabase
        .from('inventory')
        .insert({ product_id: id, stock_quantity: stockQuantity, low_stock_threshold: 5 })
        .select('id, stock_quantity, low_stock_threshold')
        .single()

    if (inventoryResult.error) {
      if (uploadedImage) await removeProductImage(uploadedImage.url)
      throw inventoryResult.error
    }
    savedInventory = inventoryResult.data
    inventoryWasUpdated = true
  }

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (inventoryWasUpdated) {
      if (existingInventory) {
        await supabase
          .from('inventory')
          .update({ stock_quantity: existingInventory.stock_quantity })
          .eq('id', existingInventory.id)
      } else {
        await supabase.from('inventory').delete().eq('id', savedInventory.id)
      }
    }
    if (uploadedImage) await removeProductImage(uploadedImage.url)
    throw error
  }

  if (uploadedImage && existingProduct.image_url) {
    await removeProductImage(existingProduct.image_url)
  }

  return { ...data, stock_quantity: Number(savedInventory?.stock_quantity) || 0 }
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

  if (error?.code === '23503') {
    // Keep the product row for historical order_items, but retire it from sale
    // and clear its stock so the Inventory page reflects the delete action.
    const { data: inventoryRecord, error: inventoryFindError } = await supabase
      .from('inventory')
      .select('id, stock_quantity, low_stock_threshold')
      .eq('product_id', id)
      .maybeSingle()

    if (inventoryFindError) throw inventoryFindError

    const { data: updatedInventory, error: inventoryUpdateError } = inventoryRecord
      ? await supabase
        .from('inventory')
        .update({ stock_quantity: 0 })
        .eq('id', inventoryRecord.id)
        .select('id, stock_quantity')
        .single()
      : await supabase
        .from('inventory')
        .insert({ product_id: id, stock_quantity: 0, low_stock_threshold: 5 })
        .select('id, stock_quantity')
        .single()

    if (inventoryUpdateError) throw inventoryUpdateError

    const { data: unavailableProduct, error: archiveError } = await supabase
      .from('products')
      .update({ is_available: false })
      .eq('id', id)
      .select()
      .single()

    if (archiveError) {
      // Restore the prior quantity if retiring the product did not succeed.
      if (inventoryRecord) {
        await supabase
          .from('inventory')
          .update({ stock_quantity: inventoryRecord.stock_quantity })
          .eq('id', inventoryRecord.id)
      } else {
        await supabase.from('inventory').delete().eq('id', updatedInventory.id)
      }
      throw archiveError
    }

    return {
      ...unavailableProduct,
      stock_quantity: 0,
      archived: true,
      out_of_stock: true
    }
  }

  if (error) throw error
  await removeProductImage(existingProduct.image_url)
  return data
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct }
