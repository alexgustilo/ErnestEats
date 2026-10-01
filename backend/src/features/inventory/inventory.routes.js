const express = require('express')
const router = express.Router()
const {getAllInventory, createInventory, updateInventory, deleteInventory} = require('./inventory.controller')

router.get('/', getAllInventory)
router.get('/', createInventory)
router.get('/:id', updateInventory )
router.get('/:id', deleteInventory)

module.exports = router