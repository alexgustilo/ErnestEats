const supabase = require('../../config/supabase')

async function getProducts(){
    const {data,error} = await supabase
    .from('products')
    .select('*')
    
    if (error){
        throw error;
    }
    return data;
}   

//create products 
async function createProduct(name,description,price,image_url,is_available,category_id){
    const {data,error} = await supabase
    .from('products')
    .insert({name:name, description:description, price:price , image_url:image_url,
            is_available:is_available, category_id:category_id})
    .select()
    .single()

    if(error){
        throw error
    }
    return data
}

//update products
async function updateProduct(id,name,description,price,image_url,is_available,category_id) {
    const {data,error} = await supabase
    .from('products')
    .update({name:name, description:description, price:price, image_url:image_url,
            is_available:is_available, category_id:category_id})
    .eq('id', id)
    .select()
    .single()

    if(error){
        throw error
    }
    return data
}

//delete products 
async function deleteProduct(id){
    const {data,error} = await supabase
    .from('products')
    .delete()
    .eq('id',id)
    .select()
    .single()

    if(error){
        throw error
    }
    return data
}

module.exports = {getProducts, createProduct, updateProduct, deleteProduct};