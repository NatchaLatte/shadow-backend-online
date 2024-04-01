const express = require('express')
const router = express.Router()
const { bannerInsert, bannerSelect, bannerUpdate, bannerDelete } = require('../controllers/banner-controller')

router.post('/banner-insert', bannerInsert)
router.get('/banner-select', bannerSelect)
router.patch('/banner-update', bannerUpdate)
router.delete('/banner-delete/:uuid', bannerDelete)

module.exports = router