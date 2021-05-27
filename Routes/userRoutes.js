const Router = require('express')
const router = new Router()
const userController = require('../controller/userСontroller.js')
const passport = require('passport')

router.post('/user', userController.createUser)
router.get('/user/:id',passport.authenticate('jwt', { session: false }), userController.getUser)
router.put('/user', userController.updateUserPassword)
router.delete('/user/:id', userController.deleteUser)

module.exports = router