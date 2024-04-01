const express = require('express')
const router = express.Router()
const { createGeneralProduct, readGeneralProduct,readGeneralProductWithUUID, readGeneralProductOldToNew, readGeneralProductNewToOld,
        readGeneralProductCheapToExpensive, readGeneralProductExpensiveToCheap, readGeneral3Product, updateGeneralProduct, updateStatusPrice, deleteGeneralProduct,
        readPromotionProduct, readPromotionProductWithUUID, readPromotionProductOldToNew, readPromotionProductNewToOld, readPromotionProductCheapToExpensive,
        readPromotionProductExpensiveToCheap, readPromotion3Product } = require('../controllers/general-product-controller')

router.post('/create-general-product', createGeneralProduct)
router.get('/read-general-product', readGeneralProduct)
router.get('/read-general-product-uuid/:uuid', readGeneralProductWithUUID)
router.get('/read-general-product-old-to-new', readGeneralProductOldToNew)
router.get('/read-general-product-new-to-old', readGeneralProductNewToOld)
router.get('/read-general-product-cheap-to-expensive', readGeneralProductCheapToExpensive)
router.get('/read-general-product-expensive-to-cheap', readGeneralProductExpensiveToCheap)
router.get('/read-general-3-product', readGeneral3Product)
router.patch('/update-general-product/:uuid', updateGeneralProduct)
router.patch('/update-status-price/:uuid', updateStatusPrice)
router.delete('/delete-general-product/:uuid', deleteGeneralProduct)

// -------------------------------------------------------------------- [ Promotion ] -------------------------------------------------------------------- //

router.get('/read-promotion-product', readPromotionProduct)
router.get('/read-promotion-product-uuid/:uuid', readPromotionProductWithUUID)
router.get('/read-promotion-product-old-to-new', readPromotionProductOldToNew)
router.get('/read-promotion-product-new-to-old', readPromotionProductNewToOld)
router.get('/read-promotion-product-cheap-to-expensive', readPromotionProductCheapToExpensive)
router.get('/read-promotion-product-expensive-to-cheap', readPromotionProductExpensiveToCheap)
router.get('/read-promotion-3-product', readPromotion3Product)

module.exports = router