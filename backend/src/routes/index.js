const express = require('express');
const router = express.Router();
const authRoutes = require('../features/auth/auth.routes');
const categoriesRoutes = require('../features/categories/categories.routes')
const productsRoutes = require('../features/products/products.routes')

router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes)
router.use('/products', productsRoutes)

module.exports = router;