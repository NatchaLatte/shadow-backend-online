const express = require('express')
const router = express.Router()
const { topUp } = require('../controllers/topup-controller')

router.post('/topup', topUp)

module.exports = router