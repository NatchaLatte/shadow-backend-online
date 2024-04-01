const express = require('express')
const router = express.Router()
const { sendOTP, reciveOTP } = require('../controllers/otp-controller')

router.post('/send-otp', sendOTP)
router.post('/recive-otp', reciveOTP)

module.exports = router