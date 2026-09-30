const supabase = require('../../config/supabase')

// get inventory
async function getInventory() {

    const { data, error } = await supabase
        .from('inventory')
        .select('*')

    if (error) {
        throw error
    }

    return data
}

// create inventory
async function createInventory(product_id, stock_quantity, low_stock_threshold) {

    const { data, error } = await supabase
        .from('inventory')
        .insert({   
            product_id: product_id, 
            stock_quantity: stock_quantity,
            low_stock_threshold: low_stock_threshold
            })
        .select()
        .single()

    if (error) {                                                                        
        throw error
    }

    return data
}


// update inventory
async function updateInventory(id, product_id, stock_quantity, low_stock_threshold) {

    const { data, error } = await supabase
        .from('inventory')
        .update({product_id: product_id,stock_quantity: stock_quantity,low_stock_threshold: low_stock_threshold
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}


// delete inventory
async function deleteInventory(id) {

    const { data, error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}


module.exports = {
    getInventory,
    createInventory,
    updateInventory,
    deleteInventory
}