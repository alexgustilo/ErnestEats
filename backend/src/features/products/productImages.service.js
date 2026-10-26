const { randomUUID } = require('node:crypto')
const supabase = require('../../config/supabase')

const BUCKET = process.env.SUPABASE_PRODUCT_IMAGES_BUCKET || 'product-images'
const extensionsByType = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
}

async function uploadProductImage(file) {
  if (!file) return null

  const extension = extensionsByType[file.mimetype]
  if (!extension) {
    const error = new Error('Choose a JPG, PNG, or WebP product image.')
    error.statusCode = 400
    throw error
  }

  const path = `products/${randomUUID()}.${extension}`
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file.buffer, {
      cacheControl: '3600',
      contentType: file.mimetype,
      upsert: false
    })

  if (error) {
    const uploadError = new Error(
      `Could not upload product image. Confirm that the public "${BUCKET}" Storage bucket exists. ${error.message}`
    )
    uploadError.statusCode = 502
    throw uploadError
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path)

  return { path: data.path, url: publicUrlData.publicUrl }
}

async function removeProductImage(imageUrl) {
  if (!imageUrl || !process.env.SUPABASE_URL) return

  try {
    const projectUrl = new URL(process.env.SUPABASE_URL)
    const image = new URL(imageUrl)
    const publicPrefix = `/storage/v1/object/public/${BUCKET}/`

    if (image.origin !== projectUrl.origin || !image.pathname.startsWith(publicPrefix)) return

    const path = decodeURIComponent(image.pathname.slice(publicPrefix.length))
    // Only delete files created by this feature; leave unrelated or legacy media alone.
    if (!/^products\/[0-9a-f-]+\.(jpg|png|webp)$/i.test(path)) return

    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) console.warn('Could not remove old product image:', error.message)
  } catch (error) {
    console.warn('Could not remove old product image:', error.message)
  }
}

module.exports = { uploadProductImage, removeProductImage }
