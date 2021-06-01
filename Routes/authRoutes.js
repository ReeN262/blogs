const Router = require('express')
const router = new Router()
const authController = require('../controller/authController')
const { check} = require('express-validator');


router.post('/register', [
    check('name', 'Username must be between 4 and 20 characters').isLength({min: 4, max: 20}),
    check('email', 'Invalid email').isEmail()
], authController.registerUser)
router.post('/login', [ 
    check('name', 'Username must be between 4 and 20 characters').isLength({min: 4, max: 20}),
    check('email', 'Invalid email').isEmail()
],authController.authorizationUser)


module.exports = router