const db = require('../db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { secret } = require('../secretkey')
const { validationResult } = require('express-validator');


class authUser {
    async registerUser(data, res) {
        try {
            const errors = validationResult(data)
            if (!errors.isEmpty()) {
                return res.status(400).json({messsage: "Ошибка при регистрации", errors})
            }
            const { name, password, email } = data.body
            const date = new Date()
            let hashPassword = bcrypt.hashSync(password, 10);
            const Email = await db.query("select email from users where email = $1", [email])
            if (Email.rowCount == 0) {
                const user = await db.query('INSERT INTO users(name, password, email) values($1, $2, $3) RETURNING *', [name, hashPassword, email])
                return res.status(200).json({
                    auth: true,
                    date: date.toISOString().substr(0,10),
                    user: {
                        id: user.rows[0].id_user,
                        name: user.rows[0].name,
                        email: user.rows[0].email
                    }

                })
            } else {
                return res.status(200).json({
                    "error": true,
                    "message": "Почта уже зарегистрирована"
                })
            }
        } catch (e) {
            res.status(400).json(e)
        }
    }
    async authorizationUser(data, res) {
        try {
            const { email, password} = data.body
            const user = await db.query('select password from users where email = $1', [email])
            const encryptPaswrd = bcrypt.compareSync(password, user.rows[0].password);
            if (encryptPaswrd == true) { 
                const token = jwt.sign({email: email}, secret, {expiresIn: 60 * 60})
                return res.status(200).json({token: `Bearer ${token}`})
            } else {
                return res.status(200).json({password: false}) 
            }
        } catch (e) {
            return res.status(500).json(e)
        }
    }
}

module.exports = new authUser()