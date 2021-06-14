const Router = require('express');
const passport = require('passport');
const router = new Router();
const { check } = require('express-validator');

const commentContoller = require('../controller/commentController');

router.post(
  '/create', 
  passport.authenticate('jwt', { session: false }),

  check('post_id', 'Fields are empty').notEmpty(),
  check('content', 'Fields are empty').notEmpty(),
  check('content', 'Comment must not exceed 255 characters').isLength({max: 255}),

  commentContoller.newComments
);
router.post(
  '/answer',
  passport.authenticate('jwt',{ session: false }),

  check('comment_id', 'Fields are empty').notEmpty(),
  check('content', 'Fields are empty').notEmpty(),
  check('content', 'Comment must not exceed 255 characters').isLength({max: 255}), 

  commentContoller.answerComment
);
router.get(
  '/get/:postID',
   passport.authenticate('jwt', { session: false }),

  check('postID').notEmpty(),

  commentContoller.getComments
);
router.get(
  '/get/answer/:comment_id',
  passport.authenticate('jwt', { session: false }),

  check('comment_id').notEmpty(), 

  commentContoller.getAnswers);
router.get('/like/:comment_id', passport.authenticate('jwt', { session: false }), commentContoller.commentLike);

module.exports = router;