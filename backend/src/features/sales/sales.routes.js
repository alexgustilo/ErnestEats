const express = require('express')
const router = express.Router()

const {
  getAllSales,
  createSale
} = require('./sales.controller')

router.get('/', getAllSales)
router.post('/', createSale)

module.exports = router