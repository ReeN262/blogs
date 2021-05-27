const Router = require('express')
const router = new Router()
const authController = require('../controller/authController')
const { check} = require('express-validator');


router.post('/register', [
    check('name', 'Имя пользователя должно состоять от 4 до 20 символов').isLength({min: 4, max: 20}),
    check('email', 'Недопустимый тип электронной почты').isEmail()
], authController.registerUser)
router.post('/login',authController.authorizationUser)


module.exports = router