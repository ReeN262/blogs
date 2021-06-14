const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const knex = require('../database/db');
const { secret } = require('../config/secretkey');



class auth {
  async register(req, res) {
    const { name, password, email } = req.body;
    let hashPassword = bcrypt.hashSync(password, 10);
    const Email = await knex('users').select('email').where({email: email});

    if (Email.length == 0 ) {
        await knex('users').insert({name: name, password: hashPassword, email: email});
        return {success: true};
    } else {
      return {errorMessage: 'Mail already in use'};
    }
  }
  async authorization(req) 
  {
    const { email, password } = req.body;
    const user = await knex('users').select('*').where({email: email});
    const encryptPaswrd = bcrypt.compareSync(password, user[0].password);

    if (encryptPaswrd == true) { 
      const token = jwt.sign({userID: user[0].id}, secret, {expiresIn: 60 * 60 * 60});
      return {token: `Bearer ${token}`};
    } else {
      return {errorMessage: 'Wrong password'}
    }
  }
}

module.exports = new auth()