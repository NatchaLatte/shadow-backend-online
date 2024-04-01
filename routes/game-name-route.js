const express = require('express')
const router = express.Router()
const { gameNameInsert, gameNameSelect, gameNameUpdate, gameNameDelete } = require('../controllers/game-name-controller')

router.post('/game-name-insert', gameNameInsert)
router.get('/game-name-select', gameNameSelect)
router.patch('/game-name-update/:uuid', gameNameUpdate)
router.delete('/game-name-delete/:uuid', gameNameDelete)

module.exports = router