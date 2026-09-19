const {getProducts, createProduct:createProductService, updateProduct:updateProductService} = require('./products.service')

async function  getAllProducts(req,res) {
    try{
        const products = await getProducts()
        res.status(200).json(products)
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

//create product
async function createProduct(req,res){
    console.log('Create Products')
    try{
        const {name,description,price,image_url,is_available,category_id} = req.body
        const product = await createProductService(name,description,price,image_url,is_available,category_id)

        res.status(200).json(product)
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

//update product
async function updateProduct(req,res) {
    console.log('Update Products')
    try{
        const {id} = req.params
        const {name,description,price,image_url,is_available,category_id} = req.body
        const product = await updateProductService(id,name,description,price,image_url,is_available,category_id)
        res.status(200).json(product)
    }catch(error){
        res.status(500).json({error: error.message})
    }
}











module.exports = {getAllProducts, createProduct, updateProduct}


