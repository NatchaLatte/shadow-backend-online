const historyPaymentModel = require('../models/history-payment-model')

exports.readHistoryPayment = (request, response) => {
    historyPaymentModel.readHistoryPayment(request, response)
}

exports.readSumCash = (request, response) => {
    historyPaymentModel.readSumCash(request, response)
}