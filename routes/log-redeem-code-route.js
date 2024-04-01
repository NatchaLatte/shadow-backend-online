const express = require('express')
const router = express.Router()
const { logRedeemCode, readRedeemCode } = require('../controllers/log-redeem-code-controller')

router.post('/log-redeem-code', logRedeemCode)
router.post('/read-redeem-code', readRedeemCode)

module.exports = router