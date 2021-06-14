const auth = require('../service/auth')
const { ErrorValidation } = require('../service/handler');

class authUser {
  async registerUser(req, res) {
    if (!ErrorValidation(req, res)) return false;

    let result = await auth.register(req);

    if (result) return res.status(200).json(result)
  }
  async authorizationUser(req, res) {
    if (!ErrorValidation(req, res)) return false;

    const authorization = await auth.authorization(req)

    if (authorization) return res.status(200).json(authorization)
  }
}

module.exports = new authUser()