const supabase = require('../../config/supabase')

//select categories
async function getCategories(){
    const {data,error} = await supabase
    .from('categories')
    .select('*')

    if (error){
        throw error
    }
    return data
}

//create categories
async function createCategory(name){
    const {data,error} = await supabase
    .from('categories')
    .insert({name: name})
    .select()
    .single()

    if (error){
        throw error
    }
    return data
}

//update categories
async function updateCategory(id,name){
    const {data,error} = await supabase
    .from('categories')
    .update({name: name})
    .eq('id', id)
    .select()
    .single()

    if (error){
        throw error
    }
    return data
}

//delete categories
async function deleteCategory(id){
    const {data,error} = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .select()
    .single()

    if (error){
        throw error
    }
    return data
}

module.exports = {getCategories, createCategory, updateCategory, deleteCategory};