const logRedeemCodeModel = require('../models/log-redeem-code-model')

exports.logRedeemCode = (request, response) => {
    logRedeemCodeModel.logRedeemCode(request, response)
}

exports.readRedeemCode = (request, response) => {
    logRedeemCodeModel.readRedeemCode(request, response)
}