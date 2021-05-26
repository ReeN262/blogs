const Router = require('express')
const router = new Router()
const userController = require('../controller/userСontroller.js')

router.post('/user', userController.createUser)
router.get('/user/:id', userController.getUser)
router.put('/user', userController.updateUserPassword)
router.delete('/user/:id', userController.deleteUser)

module.exports = router