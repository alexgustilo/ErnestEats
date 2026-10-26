# Product image upload

Product images are submitted to `POST /api/products` or `PUT /api/products/:id` as multipart form data. The file field is named `image`. The API checks the authenticated user's admin role, accepts JPG/PNG/WebP images up to 5 MB, uploads them to Supabase Storage with the backend service key, and stores the resulting public URL in `products.image_url`.

## Supabase setup

1. Create a Storage bucket named `product-images` (or set `SUPABASE_PRODUCT_IMAGES_BUCKET` to another bucket name in the backend environment).
2. Mark the bucket **Public** so the customer app can display the saved public image URL.
3. Keep `SUPABASE_SERVICE_KEY` only in the backend `.env`; never add it to frontend environment variables or commit it.

Equivalent bucket configuration in Supabase SQL Editor:

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
```

The backend uses the service role key for Storage operations, so browser-side Storage upload policies are not needed. The bucket must exist before creating or updating a product with an image.

## API request fields

Send `name`, `description`, `price`, `is_available`, and `category_id` as multipart fields. Attach the optional image file as `image`. When no replacement image is provided during an update, the current image URL is preserved. Replacing or deleting a product also removes the previous file when it is one of this feature's own uploaded files.

Product writes and deletes require a bearer access token for a user whose `profiles.role` is `admin`. Reading the public menu remains unauthenticated.
