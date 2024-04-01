const otpModel = require('../models/otp-model')

exports.sendOTP = (request, response) => {
    otpModel.sendOTP(request, response)
}

exports.reciveOTP = (request, response) => {
    otpModel.reciveOTP(request, response)
}