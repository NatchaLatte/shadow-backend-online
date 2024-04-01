const bannerModel = require('../models/banner-model')

exports.bannerInsert = (request, response) => {
    bannerModel.bannerInsert(request, response)
}

exports.bannerSelect = (request, response) => {
    bannerModel.bannerSelect(request, response)
}

exports.bannerUpdate = (request, response) => {
    bannerModel.bannerUpdate(request, response)
}

exports.bannerDelete = (request, response) => {
    bannerModel.bannerDelete(request, response)
}