const express = require('express')
const router = express.Router()
const { createHistoryProduct,readHistoryProduct, readSumAysel, readSumBuyItems } = require('../controllers/history-product-controller')

router.post('/create-history-product', createHistoryProduct)
router.get('/read-history-product', readHistoryProduct)
router.get('/read-sum-aysel', readSumAysel)
router.get('/read-sum-buy-items', readSumBuyItems)

module.exports = router