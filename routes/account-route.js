const express = require('express')
const router = express.Router()
const { validationAccount, signUpAccount, signInAccount, signOutAccount, authenticationAccount, selectAccount, 
        updateStatusAccount, updateUsername, updateAvatar, updateGachaCount } = require('../controllers/account-controller')

router.post('/sign-up-validation', validationAccount)
router.post('/sign-up-account', signUpAccount)
router.post('/sign-in-account', signInAccount)
router.get('/sign-out-account', signOutAccount)
router.get('/authentication-account', authenticationAccount)
router.get('/select-account', selectAccount)
router.patch('/update-status-account/:email', updateStatusAccount)
router.patch('/update-username/:email', updateUsername)
router.patch('/update-avatar', updateAvatar)
router.patch('/update-gacha-count/:email', updateGachaCount)

module.exports = router