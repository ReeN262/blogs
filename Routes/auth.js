const Router = require('express')
const router = new Router()
const authController = require('../controller/authController')

router.post('/auth', authController.registerUser)
router.get('/auth', authController.authorizationUser)


module.exports = router