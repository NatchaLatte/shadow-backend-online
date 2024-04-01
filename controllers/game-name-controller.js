const gameNameModel = require('../models/game-name-model')

exports.gameNameInsert = (request, response) => {
    gameNameModel.gameNameInsert(request, response)
}

exports.gameNameSelect = (request, response) => {
    gameNameModel.gameNameSelect(request, response)
}

exports.gameNameUpdate = (request, response) => {
    gameNameModel.gameNameUpdate(request, response)
}

exports.gameNameDelete = (request, response) => {
    gameNameModel.gameNameDelete(request, response)
}