const Router = require('express');
const { check } = require('express-validator');

const authController = require('../controller/authController');

const router = new Router();

router.post(
  '/register', 
  [
    check('name', 'Username must be between 4 and 20 characters').isLength({min: 4, max: 20}),
    check('email', 'Invalid email').isEmail(),
    check('password').isLength({'min': 4})
  ], 
  authController.registerUser
);
router.post(
  '/login',
  [ 
    check('email', 'Invalid email').isEmail(),
    check('password').isLength({'min': 4})
  ],
  authController.authorizationUser
);


module.exports = router;