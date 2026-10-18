const express = require('express')
const router = express.Router()

const {
  getAllInventory,
  createInventory,
  updateInventory,
  deleteInventory
} = require('./inventory.controller')

router.get('/', getAllInventory)
router.post('/', createInventory)
router.put('/:id', updateInventory)
router.delete('/:id', deleteInventory)

module.exports = router