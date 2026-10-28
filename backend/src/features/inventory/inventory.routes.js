const express = require('express')
const router = express.Router()
const requireAuth = require('../../middleware/auth.middleware')
const requireAdmin = require('../../middleware/role.middleware')

const {
  getAllInventory,
  createInventory,
  updateInventory,
  deleteInventory
} = require('./inventory.controller')

router.get('/', requireAuth, requireAdmin, getAllInventory)
router.post('/', requireAuth, requireAdmin, createInventory)
router.put('/:id', requireAuth, requireAdmin, updateInventory)
router.delete('/:id', requireAuth, requireAdmin, deleteInventory)

module.exports = router
