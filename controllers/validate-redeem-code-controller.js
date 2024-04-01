const validateRedeemCodeModel = require('../models/validate-redeem-code-model')

exports.validateRedeemCode = (request, response) => {
    validateRedeemCodeModel.validateRedeemCode(request, response)
}