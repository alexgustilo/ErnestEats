const express = require('express');
const router = express.Router();
const requireAuth = require('../../middleware/auth.middleware')
const requireAdmin = require('../../middleware/role.middleware')

const {getAllCategories, createCategory, updateCategory, deleteCategory} = require('./categories.controller');

router.get('/', getAllCategories)
router.post('/', requireAuth, requireAdmin, createCategory)
router.put('/:id', requireAuth, requireAdmin, updateCategory)
router.delete('/:id', requireAuth, requireAdmin, deleteCategory)

module.exports = router;
