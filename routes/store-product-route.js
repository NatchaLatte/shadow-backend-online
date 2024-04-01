const express = require('express')
const router = express.Router()
const { createStoreProduct, readStoreProduct, readLastedStoreProduct } = require('../controllers/store-product-controller')

router.post('/create-store-product', createStoreProduct)
router.get('/read-store-product', readStoreProduct)
router.get('/read-lasted-store-product', readLastedStoreProduct)

module.exports = router