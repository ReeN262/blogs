const db = require('../db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {secret} = require('../secretkey')


class authUser {
    async registerUser(data, res) {
        try {
            const { name, password, email } = data.body
            const date = new Date()
            let hashPassword = bcrypt.hashSync(password, 10);
            const validEmail = await db.query("select email from person where email = $1", [email])
            if (validEmail.rowCount == 0) {
                const user = await db.query('INSERT INTO person(name, password, email) values($1, $2, $3) RETURNING *', [name, hashPassword, email])
                res.status(200).json({
                    auth: true,
                    date: date.toISOString().substr(0,10),
                    user: {
                        id: user.rows[0].id_user,
                        name: user.rows[0].name,
                        email: user.rows[0].email
                    }

                })
            } else {
                return res.status(200).json({"Error": "This email is already in use"})
            }
        } catch (e) {
            res.status(400).json(e)
        }
    }
    async authorizationUser(data, res) {
        try {
            const { email, password} = data.body
            const user = await db.query('select password,id_user from person where email = $1', [email])
            const encryptPaswrd = bcrypt.compareSync(password, user.rows[0].password);
            if (encryptPaswrd == true) { 
                const token = jwt.sign({
                    userID: user.rows[0].id_user,
                    email: email
                }, secret, {expiresIn: 60 * 60})
                return res.status(200).json({token: `Bearer ${token}`})
            } else {
                return res.status(200).json({password: false}) 
            }
        } catch (e) {
            return res.status(400).json(e)
        }
    }
}

module.exports = new authUser()