const auctionProductModel = require('../models/auction-product-model')

exports.createAuctionProduct = (request, response) => {
    auctionProductModel.createAuctionProduct(request, response)
}

exports.readAuctionProduct = (request, response) => {
    auctionProductModel.readAuctionProduct(request, response)
}

exports.readAuctionProductAll = (request, response) => {
    auctionProductModel.readAuctionProductAll(request, response)
}

exports.readAuctionProductWithUUID = (request, response) => {
    auctionProductModel.readAuctionProductWithUUID(request, response)
}

exports.readAuctionProductOldToNew = (request, response) => {
    auctionProductModel.readAuctionProductOldToNew(request, response)
}

exports.readAuctionProductNewToOld = (request, response) => {
    auctionProductModel.readAuctionProductNewToOld(request, response)
}

exports.readAuctionProductCheapToExpensive = (request, response) => {
    auctionProductModel.readAuctionProductCheapToExpensive(request, response)
}

exports.readAuctionProductExpensiveToCheap = (request, response) => {
    auctionProductModel.readAuctionProductExpensiveToCheap(request, response)
}

exports.readAuction3Product = (request, response) => {
    auctionProductModel.readAuction3Product(request, response)
}

exports.updateAuctionProduct = (request, response) => {
    auctionProductModel.updateAuctionProduct(request, response)
}

exports.updateBid = (request, response) => {
    auctionProductModel.updateBid(request, response)
}

exports.updateAuctionStatus = (request, response) => {
    auctionProductModel.updateAuctionStatus(request, response)
}

exports.deleteAuctionProduct = (request, response) => {
    auctionProductModel.deleteAuctionProduct(request, response)
}