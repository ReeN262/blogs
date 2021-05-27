const db = require('../db')
const { validationResult } = require('express-validator')

class UserController {
    async updateUserPassword(req, res){
        const errors = validationResult(data)
        if (!errors.isEmpty()) {
            return res.status(400).json({messsage: "Ошибка смена пароля", errors})
        }
        const {email, password} = req.body
        await db.query('UPDATE users SET password = $1 where email = $2 RETURNING *', [password, email])
        res.status(200).json("Пароль изменен")   
    }
    async deleteUser(req, res){
    const id = req.params.id
    await bd.query('DELETE FROM users where id = $1', [id])
    res.status(200).json('Пользователь удален')      
    }

}

module.exports = new UserController()