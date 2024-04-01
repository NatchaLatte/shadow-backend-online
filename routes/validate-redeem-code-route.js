const express = require('express')
const router = express.Router()
const { validateRedeemCode } = require('../controllers/validate-redeem-code-controller')

router.post('/validate-redeem-code', validateRedeemCode)

module.exports = router