const express = require('express')
const router = express.Router()
const requireAuth = require('../../middleware/auth.middleware')
const requireAdmin = require('../../middleware/role.middleware')

const {
  getAllSales,
  createSale,
  getSalesSummary
} = require('./sales.controller')

router.get('/summary', requireAuth, requireAdmin, getSalesSummary)
router.get('/', requireAuth, requireAdmin, getAllSales)
router.post('/', requireAuth, requireAdmin, createSale)

module.exports = router
