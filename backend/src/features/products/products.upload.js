const multer = require('multer')

const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024
const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

const parser = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_PRODUCT_IMAGE_BYTES,
    files: 1,
    fields: 10,
    parts: 12
  },
  fileFilter(req, file, callback) {
    if (!supportedTypes.has(file.mimetype)) {
      const error = new Error('Choose a JPG, PNG, or WebP product image.')
      error.statusCode = 400
      return callback(error)
    }
    callback(null, true)
  }
})

function uploadProductImage(req, res, next) {
  parser.single('image')(req, res, (error) => {
    if (!error) return next()

    const statusCode = error.code === 'LIMIT_FILE_SIZE'
      ? 413
      : error.statusCode || 400
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Product images must be 5 MB or smaller.'
      : error.message || 'Could not read the uploaded product image.'

    return res.status(statusCode).json({ error: message })
  })
}

module.exports = uploadProductImage
