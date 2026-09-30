const {getInventory,createInventory: createInventoryService,
    updateInventory: updateInventoryService,
    deleteInventory: deleteInventoryService
} = require('./inventory.service')

// get inventory
async function getAllInventory(req, res) {
    try {
        const inventory = await getInventory()
        res.status(200).json(inventory)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// create inventory
async function createInventory(req, res) {
    try {
        const { product_id, stock_quantity, low_stock_threshold } = req.body

        const inventory = await createInventoryService(product_id,stock_quantity,low_stock_threshold)
        res.status(200).json(inventory)
    } catch (error) {
    res.status(500).json({ error: error.message })
    }
}

// update inventory
async function updateInventory(req, res) {
    try {
        const { id } = req.params
        const { product_id, stock_quantity, low_stock_threshold } = req.body

    const inventory = await updateInventoryService(id,product_id,stock_quantity,low_stock_threshold)

    res.status(200).json(inventory)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// delete inventory
async function deleteInventory(req, res) {
    try {
        const { id } = req.params
        const inventory = await deleteInventoryService(id)

        res.status(200).json(inventory)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {getAllInventory,createInventory,updateInventory,deleteInventory}

