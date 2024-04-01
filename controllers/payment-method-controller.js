const paymentMethodModel = require('../models/payment-method-model')

exports.paymentMethodSelect = (request, response) => {
    paymentMethodModel.paymentMethodSelect(request, response)
}

exports.paymentMethodUpdateImage = (request, response) => {
    paymentMethodModel.paymentMethodUpdateImage(request, response)
}

exports.paymentMethodUpdateVideo = (request, response) => {
    paymentMethodModel.paymentMethodUpdateVideo(request, response)
}

exports.deletePaymentMethodImage = (request, response) => {
    paymentMethodModel.deletePaymentMethodImage(request, response)
}

exports.deletePaymentMethodVideo = (request, response) => {
    paymentMethodModel.deletePaymentMethodVideo(request, response)
}