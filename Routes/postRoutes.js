const Router = require('express')
const router = new Router()
const postController = require('../controller/postController')
const passport = require('passport')
const upload = require('../middleware/upload_img')

router.post('/create', passport.authenticate('jwt', { session: false }), upload.single('image'),postController.postCreate)
router.post('/update',passport.authenticate('jwt', { session: false }), upload.single('image'), postController.postUpdate)
router.post('/comments', passport.authenticate('jwt', { session: false }))
router.get('/like/:id', passport.authenticate('jwt', { session: false }), postController.postLike)
router.get('/info/:id', passport.authenticate('jwt', { session: false }), postController.postInfo)

module.exports = router