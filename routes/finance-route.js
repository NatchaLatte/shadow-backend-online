const express = require('express')
const router = express.Router()
const { updateAysel } = require('../controllers/finance-controller')

router.patch('/update-aysel', updateAysel)

module.exports = router