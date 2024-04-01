const generalProductModel = require('../models/general-product-model')

exports.createGeneralProduct = (request, response) => {
    generalProductModel.createGeneralProduct(request, response)
}

exports.readGeneralProduct = (request, response) => {
    generalProductModel.readGeneralProduct(request, response)
}

exports.readGeneralProductWithUUID = (request, response) => {
    generalProductModel.readGeneralProductWithUUID(request, response)
}

exports.readGeneralProductWithName = (request, response) => {
    generalProductModel.readGeneralProductWithName(request, response)
}

exports.readGeneralProductOldToNew = (request, response) => {
    generalProductModel.readGeneralProductOldToNew(request, response)
}

exports.readGeneralProductNewToOld = (request, response) => {
    generalProductModel.readGeneralProductNewToOld(request, response)
}

exports.readGeneralProductCheapToExpensive = (request, response) => {
    generalProductModel.readGeneralProductCheapToExpensive(request, response)
}

exports.readGeneralProductExpensiveToCheap = (request, response) => {
    generalProductModel.readGeneralProductExpensiveToCheap(request, response)
}

exports.readGeneral3Product = (request, response) => {
    generalProductModel.readGeneral3Product(request, response)
}

exports.updateGeneralProduct = (request, response) => {
    generalProductModel.updateGeneralProduct(request, response)
}

exports.updateStatusPrice = (request, response) => {
    generalProductModel.updateStatusPrice(request, response)
}

exports.deleteGeneralProduct = (request, response) => {
    generalProductModel.deleteGeneralProduct(request, response)
}

// -------------------------------------------------------------------- [ Promotion ] -------------------------------------------------------------------- //

exports.readPromotionProduct = (request, response) => {
    generalProductModel.readPromotionProduct(request, response)
}

exports.readPromotionProductWithUUID = (request, response) => {
    generalProductModel.readPromotionProductWithUUID(request, response)
}

exports.readPromotionProductOldToNew = (request, response) => {
    generalProductModel.readPromotionProductOldToNew(request, response)
}

exports.readPromotionProductNewToOld = (request, response) => {
    generalProductModel.readPromotionProductNewToOld(request, response)
}

exports.readPromotionProductCheapToExpensive = (request, response) => {
    generalProductModel.readPromotionProductCheapToExpensive(request, response)
}

exports.readPromotionProductExpensiveToCheap = (request, response) => {
    generalProductModel.readPromotionProductExpensiveToCheap(request, response)
}

exports.readPromotion3Product = (request, response) => {
    generalProductModel.readPromotion3Product(request, response)
}