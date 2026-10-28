const express = require('express')
const router = express.Router()

const authRoutes = require('../features/auth/auth.routes')
const categoriesRoutes = require('../features/categories/categories.routes')
const productsRoutes = require('../features/products/products.routes')
const inventoryRoutes = require('../features/inventory/inventory.routes')
const orderRoutes = require('../features/orders/orders.routes')
const salesRoutes = require('../features/sales/sales.routes')
const notificationsRoutes = require('../features/notifications/notifications.routes')
const profileRoutes = require('../features/profile/profile.routes')

router.use('/auth', authRoutes)
router.use('/categories', categoriesRoutes)
router.use('/products', productsRoutes)
router.use('/inventory', inventoryRoutes)
router.use('/orders', orderRoutes)
router.use('/sales', salesRoutes)
router.use('/notifications', notificationsRoutes)
router.use('/profile', profileRoutes)

module.exports = router