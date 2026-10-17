const express = require('express')
const router = express.Router()

const {
  getAllSales,
  createSale,
  getSalesSummary
} = require('./sales.controller')

router.get('/summary', getSalesSummary)
router.get('/', getAllSales)
router.post('/', createSale)

module.exports = router