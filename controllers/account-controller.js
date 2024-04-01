const accountModel = require('../models/account-model')

exports.validationAccount = (request, response) => {
    accountModel.validationAccount(request, response)
}

exports.signUpAccount = (request, response) => {
    accountModel.signUpAccount(request, response)
}

exports.signInAccount = (request, response) => {
    accountModel.signInAccount(request, response)
}

exports.signOutAccount = (request, response) => {
    accountModel.signOutAccount(request, response)
}

exports.authenticationAccount = (request, response) => {
    accountModel.authenticationAccount(request, response)
}

exports.selectAccount = (request, response) => {
    accountModel.selectAccount(request, response)
}

exports.updateStatusAccount = (request, response) => {
    accountModel.updateStatusAccount(request, response)
}

exports.updateUsername = (request, response) => {
    accountModel.updateUsername(request, response)
}

exports.updateAvatar = (request, response) => {
    accountModel.updateAvatar(request, response)
}

exports.updateGachaCount = (request, response) => {
    accountModel.updateGachaCount(request, response)
}