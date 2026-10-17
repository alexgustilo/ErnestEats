const {
  getSales,
  createSale: createSaleService
} = require('./sales.service')

// get all sales
async function getAllSales(req, res) {
  try {
    const sales = await getSales()
    res.status(200).json(sales)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// create sale from an order
async function createSale(req, res) {
  try {
    const { order_id } = req.body
    const sale = await createSaleService(order_id)

    res.status(201).json(sale)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllSales,
  createSale
}