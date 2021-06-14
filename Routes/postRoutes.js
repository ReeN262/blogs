const Router = require('express');
const passport = require('passport');
const router = new Router();
const { check } = require('express-validator');

const postController = require('../controller/postController');
const upload = require('../middleware/upload_img');

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  upload.single('image'),

  check('title', 'Empty value title').notEmpty(),
  check('content', 'Empty value content').notEmpty(),
  
  postController.Create
);
router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  upload.single('image'),


  postController.Update
);
router.get('/blog/info', passport.authenticate('jwt', { session: false }), postController.infoList);
router.get('/infoblogs/:id', passport.authenticate('jwt', { session: false }), postController.Info);
router.get('/like/:id', passport.authenticate('jwt', { session: false }), postController.postLike);


module.exports = router;