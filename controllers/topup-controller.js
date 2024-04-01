const topUpModel = require('../models/topup-model')

exports.topUp = (request, response) => {
    topUpModel.topUp(request, response)
}