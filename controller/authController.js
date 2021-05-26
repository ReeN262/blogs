const db = require('../db')
var CryptoJS = require("crypto-js");

class authUser {
    async registerUser(data, res) {
        try {
            const { name, password, email } = data.body
            const encryptPaswrd = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
            
            const validEmail = await db.query("select name from person where name LIKE $1", [email])
            if (validEmail.rows.length == 0) {
                const user = await db.query('INSERT INTO person(name, password, email) values($1, $2, $3) RETURNING *', [name, encryptPaswrd, email])
                res.status(200).json(user.rows[0])
            } else {
                res.status(200).json({"Error": "This email is already in use"})
            }
        } catch (e) {
            res.status(400).json(e)
        }
    }
    async authorizationUser(data, res) {
        try {
            const { email, password} = data.body
            const user = await db.query('select password from person where email = $1', [email])
            const encryptPaswrd = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
            if (encryptPaswrd === user.rows[0].password) { 
                res.status(200).json({password: true})
            } else {
                res.status(200).json({password: false}) 
            }
        } catch (e) {
                res.status(400).json(e)
        }
    }
}

module.exports = new authUser()