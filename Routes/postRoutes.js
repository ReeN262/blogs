const Router = require('express')
const passport = require('passport')
const router = new Router()
const postController = require('../controller/postController')
const upload = require('../middleware/upload_img')

router.post('/create', passport.authenticate('jwt', { session: false }), upload.single('image'), postController.postCreate)
router.post('/update',passport.authenticate('jwt', { session: false }), upload.single('image'), postController.postUpdate)
router.get('/blog/info', passport.authenticate('jwt', { session: false }), postController.info)
router.get('/infoblogs/:id', passport.authenticate('jwt', { session: false }), postController.postInfo)
router.get('/like/:id', passport.authenticate('jwt', { session: false }), postController.postLike)
router.post('/comments', passport.authenticate('jwt', { session: false }), postController.newComments)
router.post('/answer', passport.authenticate('jwt', { session: false }), postController.answerComment)
router.get('/get/comment/:postID', passport.authenticate('jwt', { session: false }), postController.getComments)
router.get('/like/comments', passport.authenticate('jwt', { session: false }), postController.commentLike)
router.get('/get/answer/:commentID', passport.authenticate('jwt', { session: false }), postController.getAnswers)

module.exports = router