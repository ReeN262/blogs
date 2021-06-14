const bcrypt = require('bcryptjs');

const knex = require('../database/db');

class User {
  async changePassword(req){
    let password = req.body.password;
    let hashPassword = await bcrypt.hashSync(password, 10);
    
    await knex('users').update({password: hashPassword}).where({id: req.user.id});
    return {success: true};
  }
  async delete(req){
    await knex('users').delete().where({id: req.user.id});
    return {success: true};
  }
}

module.exports = new User()