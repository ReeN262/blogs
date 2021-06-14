const comment = require('../service/comment');
const {ErrorValidation} = require('../service/handler');

class commentContoller {
  async newComments(req, res){
    if (!ErrorValidation(req, res)) return false;

    let result = await comment.newComments(req);

    return res.status(200).json(result)
  }
  async commentLike(req, res) {
    let result = await comment.commentLike(req);
    return res.status(200).json(result);
  }
  async answerComment(req, res) {
    if (!ErrorValidation(req, res)) return false;

    let result = await comment.answerComment(req);
    return res.status(200).json(result);
  }
  async getComments(req, res) {
    if (!ErrorValidation(req, res)) return false;
    
   let result = await comment.getComments(req);
   return res.status(200).json(result);
  }
  async getAnswers(req, res) {
    if (!ErrorValidation(req, res)) return false;

    let result = await comment.getAnswers(req);
    return res.status(200).json(result);
  }
}

module.exports = new commentContoller();