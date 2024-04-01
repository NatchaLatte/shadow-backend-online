const storeProductModel = require('../models/store-product-model')

exports.createStoreProduct = (request, response) => {
    storeProductModel.createStoreProduct(request, response)
}

exports.readStoreProduct = (request, response) => {
    storeProductModel.readStoreProduct(request, response)
}

exports.readLastedStoreProduct = (request, response) => {
    storeProductModel.readLastedStoreProduct(request, response)
}