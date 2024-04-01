const gachaProductModel = require('../models/gacha-product-model')

exports.createGachaProduct = (request, response) => {
    gachaProductModel.createGachaProduct(request, response)
}

exports.readGachaProduct = (request, response) => {
    gachaProductModel.readGachaProduct(request, response)
}

exports.readGachaProductWithNormal = (request, response) => {
    gachaProductModel.readGachaProductWithNormal(request, response)
}

exports.readGachaProductWithSpecial = (request, response) => {
    gachaProductModel.readGachaProductWithSpecial(request, response)
}

exports.readGachaProductWithUUID = (request, response) => {
    gachaProductModel.readGachaProductWithUUID(request, response)
}

exports.readGachaProductOldToNew = (request, response) => {
    gachaProductModel.readGachaProductOldToNew(request, response)
}

exports.readGachaProductNewToOld = (request, response) => {
    gachaProductModel.readGachaProductNewToOld(request, response)
}

exports.readGachaProductCheapToExpensive = (request, response) => {
    gachaProductModel.readGachaProductCheapToExpensive(request, response)
}

exports.readGachaProductExpensiveToCheap = (request, response) => {
    gachaProductModel.readGachaProductExpensiveToCheap(request, response)
}

exports.readGacha3Product = (request, response) => {
    gachaProductModel.readGacha3Product(request, response)
}

exports.updateGachaProduct = (request, response) => {
    gachaProductModel.updateGachaProduct(request, response)
}

exports.updateGuaranteeStatus = (request, response) => {
    gachaProductModel.updateGuaranteeStatus(request, response)
}

exports.deleteGachaProduct = (request, response) => {
    gachaProductModel.deleteGachaProduct(request, response)
}