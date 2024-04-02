const express = require('express')
const router = express.Router()
const { createHistoryProduct,readHistoryProduct, readSumAysel, readSumBuyItems,readTop10 } = require('../controllers/history-product-controller')

router.post('/create-history-product', createHistoryProduct)
router.get('/read-history-product', readHistoryProduct)
router.get('/read-sum-aysel', readSumAysel)
router.get('/read-sum-buy-items', readSumBuyItems)
router.get('/read-top-10', readTop10)

module.exports = router