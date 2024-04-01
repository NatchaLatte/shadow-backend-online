const historyProductModel = require('../models/history-product-model')

exports.createHistoryProduct = (request, response) => {
    historyProductModel.createHistoryProduct(request, response)
}

exports.readHistoryProduct = (request, response) => {
    historyProductModel.readHistoryProduct(request, response)
}

exports.readSumAysel = (request, response) => {
    historyProductModel.readSumAysel(request, response)
}

exports.readSumBuyItems = (request, response) => {
    historyProductModel.readSumBuyItems(request, response)
}