const financeModel = require('../models/finance-model')

exports.updateAysel = (request, response) => {
    financeModel.updateAysel(request, response)
}

exports.getAysel = (request, response) => {
    financeModel.getAysel(request, response)
}