const Router = require('express')
const router = new Router()
const authController = require('../controller/authController')

router.post('/register', authController.registerUser)
router.post('/login', authController.authorizationUser)


module.exports = router