const Router = require('express')
const router = new Router()
const userController = require('../controller/userСontroller.js')
const passport = require('passport')
const { check } = require('express-validator')

router.post('/user', [ 
    check('password', "Пароль должен быть больше 6 символом").isLength({min: 6}),
], userController.updateUserPassword)
router.delete('/user/:id', userController.deleteUser)

module.exports = router