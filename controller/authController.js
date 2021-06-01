const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../database/db')
const { secret } = require('../config/secretkey')


class authUser {
    async registerUser(data, res) {
        try {
            const errorFormatter = ({msg}) => {
                return {errorMessage:`${msg}`};
            }
            const errors = validationResult(data).formatWith(errorFormatter);
            if (!errors.isEmpty()) {
                return res.status(400).json({success: false, error: errors.array()})
            }
            const { name, password, email } = data.body
            let hashPassword = bcrypt.hashSync(password, 10);
            const Email = await db.query("select email from users where email = $1", [email])
            if (Email.rowCount == 0) {
                await db.query('INSERT INTO users(name, password, email) values($1, $2, $3) RETURNING *', [name, hashPassword, email])
                return res.status(200).json({success: true})
            } else {
                return res.status(400).json({success: false, errorMessage: "Еmail is already in use!"})
            }
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async authorizationUser(data, res) {
        try {
            const errorFormatter = ({msg}) => {
                return {errorMessage:`${msg}`};
            }
            const errors = validationResult(data).formatWith(errorFormatter);
            if (!errors.isEmpty()) {
                return res.status(400).json({success: false, error: errors.array()})
            }
            const { email, password} = data.body
            const user = await db.query('select password,id from users where email = $1', [email])
            if (user.rows == 0) return res.status(400).json({success: false, password: false})
            const encryptPaswrd = bcrypt.compareSync(password, user.rows[0].password);
            if (encryptPaswrd == true) { 
                const token = jwt.sign({userID: user.rows[0].id}, secret, {expiresIn: 60 * 60 * 60})
                return res.status(200).json({success: true, token: `Bearer ${token}`})
            } else {
                return res.status(400).json({success: false, password: false}) 
            }
        } catch (e) {
            return res.status(500).json(e)
        }
    }
}

module.exports = new authUser()