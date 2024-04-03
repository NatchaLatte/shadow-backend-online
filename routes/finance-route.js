const express = require('express')
const router = express.Router()
const { updateAysel, getAysel } = require('../controllers/finance-controller')

router.patch('/update-aysel', updateAysel)
router.post('/get-aysel', getAysel)

module.exports = router