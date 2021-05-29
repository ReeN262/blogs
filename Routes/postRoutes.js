const Router = require('express')
const router = new Router()
const postController = require('../controller/postController')
const passport = require('passport')
const upload = require('../middleware/upload_img')

router.post('/create', passport.authenticate('jwt', { session: false }), upload.single('image'), postController.postCreate)
router.post('/update', passport.authenticate('jwt', { session: false }))
router.post('/comments', passport.authenticate('jwt', { session: false }))
router.post('/like', passport.authenticate('jwt', { session: false }))

module.exports = router