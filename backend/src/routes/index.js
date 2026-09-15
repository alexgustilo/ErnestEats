const express = require('express');
const router = express.Router();
const authRoutes = require('../features/auth/auth.routes');
const categoriesRoutes = require('../features/categories/categories.routes')


router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes)

module.exports = router;