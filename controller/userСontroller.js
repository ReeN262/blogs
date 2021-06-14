const user = require('../service/users')
const { ErrorValidation } = require('../service/handler')


class UserController {
  async updateUserPassword(req, res){
    if (!ErrorValidation(req, res)) return false;

    let result = await user.changePassword(req);

    if (result) return res.status(200).json(result);
  }
  async infoUser(req, res){
    return res.status(200).json({info: req.user});
  }
  async deleteUser(req, res){
    let result = await user.delete(req);

    if (result) return res.status(200).json(result);
  }
}

module.exports = new UserController()