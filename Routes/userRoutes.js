const Router = require('express')
const passport = require('passport')
const { check } = require('express-validator')

const router = new Router()
const userController = require('../controller/userСontroller.js')

router.post(
  '/changePassword', 
  passport.authenticate('jwt', { session: false }), 
  [ 
    check('password').isLength({min: 6})
  ], 
  userController.updateUserPassword
)
router.get('/info', passport.authenticate('jwt', { session: false }), userController.infoUser)
router.post('/delete', passport.authenticate('jwt', { session: false }),userController.deleteUser)

module.exports = router