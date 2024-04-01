const express = require('express')
const router = express.Router()
const { paymentMethodSelect, paymentMethodUpdateImage, paymentMethodUpdateVideo, deletePaymentMethodImage, deletePaymentMethodVideo} = require('../controllers/payment-method-controller')

router.get('/payment-method-select', paymentMethodSelect)
router.patch('/payment-method-update-image', paymentMethodUpdateImage)
router.patch('/payment-method-update-video', paymentMethodUpdateVideo)
router.delete('/delete-payment-method-image/:uuid', deletePaymentMethodImage)
router.delete('/delete-payment-method-video/:uuid', deletePaymentMethodVideo)

module.exports = router