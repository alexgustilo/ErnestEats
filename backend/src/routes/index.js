const express = require('express');
const router = express.Router();
const authRoutes = require('../features/auth/auth.routes');
const categoriesRoutes = require('../features/categories/categories.routes')
const productsRoutes = require('../features/products/products.routes')
const orderRoutes = require('../features/orders/orders.routes')
const salesRoutes = require('../features/sales/sales.routes')
const notificationsRoutes = require('../features/notifications/notifications.routes')

router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes)
router.use('/products', productsRoutes)
router.use('/orders', orderRoutes)
router.use('/sales', salesRoutes)
router.use('/notifications', notificationsRoutes)


module.exports = router;