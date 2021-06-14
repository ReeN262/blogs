const post = require('../service/post');
const { ErrorValidation } = require('../service/handler');

class postController {
  async Create(req, res) {
    if (!ErrorValidation(req, res)) return false;

    let result = await post.Create(req);
    return res.status(200).json(result);
  }
  async Update(req, res) {
    let result = await post.Update(req, res);
    return res.status(200).json(result);
  }
  async Info(req, res) {
    let result = await post.Info(req);
    return res.status(200).json(result);
  }
  async infoList(req, res) {
    let result = await post.infoList(req);
    return res.status(200).json(result);
  }
  async postLike(req, res) {
    let result = await post.postLike(req);
    return res.status(200).json(result);
  }
}

module.exports = new postController();