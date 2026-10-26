const express = require('express');
const router = express.Router();
const {getAllProducts,createProduct,updateProduct,deleteProduct} = require('./products.controller');
const requireAuth = require('../../middleware/auth.middleware');
const requireAdmin = require('../../middleware/role.middleware');
const uploadProductImage = require('./products.upload');


router.get('/', getAllProducts)
router.post('/', requireAuth, requireAdmin, uploadProductImage, createProduct)
router.put('/:id', requireAuth, requireAdmin, uploadProductImage, updateProduct)
router.delete('/:id', requireAuth, requireAdmin, deleteProduct)


module.exports = router;
