const {getCategories, createCategory: createCategoryService ,
    updateCategory: updateCategoryService, deleteCategory: deleteCategoryService} = require('./categories.service')

async function getAllCategories(req,res){
    try{
        const categories = await getCategories();
        res.status(200).json(categories)
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

async function createCategory(req,res){
    console.log("CREATE CATEGORY REACH")
    try{
        const {name} = req.body

        const category = await createCategoryService(name)
        res.status(200).json(category)
    }catch (error){
        res.status(500).json({error: error.message})
    }
}

async function updateCategory(req,res){
    console.log("UPDATE CATEGORY REACH")
    try{
        const {id} = req.params
        const {name} = req.body

        const category = await updateCategoryService(id,name)
        res.status(200).json(category)
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

async function deleteCategory(req,res) {
    console.log('DELETE CATEGORY REACH')
    try{
        const {id} = req.params
        const category = await deleteCategoryService(id)
        res.status(200).json(category)
    }catch(error){
        console.log("Delete Category Error", error)
        res.status(500).json({error: error.message})
    }
}
module.exports = {getAllCategories, createCategory, updateCategory , deleteCategory};