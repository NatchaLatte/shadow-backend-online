const express = require('express')
const router = express.Router()
const { readHistoryPayment, readSumCash } = require('../controllers/history-payment-controller')

router.get('/read-history-payment', readHistoryPayment)
router.get('/read-sum-cash', readSumCash)

module.exports = router