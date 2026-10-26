const {
  getProducts,
  createProduct: createProductService,
  updateProduct: updateProductService,
  deleteProduct: deleteProductService
} = require('./products.service')

function parseProductInput(body, { isCreate = false } = {}) {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const description = typeof body.description === 'string' ? body.description.trim() : ''
  if (body.price === undefined || body.price === null || String(body.price).trim() === '') {
    const error = new Error('Price is required.')
    error.statusCode = 400
    throw error
  }
  const price = Number(body.price)

  if (!name) {
    const error = new Error('Product name is required.')
    error.statusCode = 400
    throw error
  }

  if (!Number.isFinite(price) || price < 0) {
    const error = new Error('Price must be a valid non-negative number.')
    error.statusCode = 400
    throw error
  }

  let is_available = body.is_available
  if (typeof is_available === 'string') {
    if (is_available !== 'true' && is_available !== 'false') {
      const error = new Error('Availability must be true or false.')
      error.statusCode = 400
      throw error
    }
    is_available = is_available === 'true'
  }
  if (typeof is_available !== 'boolean') is_available = true

  // Product image URLs are created by the backend after its Storage upload.
  if (body.image_url) {
    const error = new Error('Send an image file in the "image" field instead of an image URL.')
    error.statusCode = 400
    throw error
  }

  const product = { name, description, price, is_available }
  if (body.category_id !== undefined) {
    product.category_id = body.category_id === '' ? null : body.category_id
  } else if (isCreate) {
    product.category_id = null
  }

  return product
}

function validateImageSignature(file) {
  if (!file) return

  const { buffer, mimetype } = file
  const isJpeg = mimetype === 'image/jpeg' && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  const isPng = mimetype === 'image/png' && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const isWebp = mimetype === 'image/webp' && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP'

  if (!isJpeg && !isPng && !isWebp) {
    const error = new Error('The uploaded file is not a valid JPG, PNG, or WebP image.')
    error.statusCode = 400
    throw error
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await getProducts()
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

async function createProduct(req, res) {
  try {
    validateImageSignature(req.file)
    const input = parseProductInput(req.body, { isCreate: true })
    const product = await createProductService(input, req.file)
    res.status(201).json(product)
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

async function updateProduct(req, res) {
  try {
    validateImageSignature(req.file)
    const input = parseProductInput(req.body)
    const product = await updateProductService(req.params.id, input, req.file)
    res.status(200).json(product)
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await deleteProductService(req.params.id)
    res.status(200).json(product)
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

module.exports = {getAllProducts, createProduct, updateProduct, deleteProduct}
