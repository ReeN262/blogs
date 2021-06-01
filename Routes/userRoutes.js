const Router = require('express')
const router = new Router()
const userController = require('../controller/userСontroller.js')
const passport = require('passport')
const { check } = require('express-validator')

router.post('/changePassword', passport.authenticate('jwt', { session: false }), [ 
    check('password', "The password must be between 6 and 20 characters long").isLength({min: 6, max: 20})
], userController.updateUserPassword)
router.get('/info', passport.authenticate('jwt', { session: false }), userController.infoUser)
router.post('/deleteUser', passport.authenticate('jwt', { session: false }),userController.deleteUser)

module.exports = router