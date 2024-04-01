const express = require('express')
const router = express.Router()
const { logRedeemCode, readRedeemCode } = require('../controllers/log-redeem-code-controller')

router.post('/log-redeem-code', logRedeemCode)
router.get('/read-redeem-code', readRedeemCode)

module.exports = router