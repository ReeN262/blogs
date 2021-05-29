const db = require('../db')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

class UserController {
    async updateUserPassword(req, res){
        try {
            const errorFormatter = ({msg}) => {
                return {errorMessage:`${msg}`};
            }
            const errors = validationResult(req).formatWith(errorFormatter);
            if (!errors.isEmpty()) {
                return res.status(400).json({success: false, error: errors.array()})
            }
            const {password} = req.body
            let hashPassword = await bcrypt.hashSync(password, 10);
            await db.query('UPDATE users SET password = $1 where id = $2 RETURNING *', [hashPassword, req.user.id])
            res.status(200).json({success: true, message: "Пароль изменен"})   
        } catch(e) {
            return res.status(500).json(e)
        }
    }
    async infoUser(req, res){
        try {
            res.status(200).json({success: true, info: req.user})  
        } catch(e) {
            return res.status(500).json(e)
        }
    }
    async deleteUser(req, res){
        try {
            if (req.user.id != null) {
                await bd.query('DELETE FROM users where id = $1', [req.user.id])
                res.status(200).json({success: true, message: 'Пользователь удален'})  
            } else {
                res.status(400).json({success: false, errorMessage: 'Пользователь не найден'})
            }
        } catch(e) {
            return res.status(500).json(e)
        }
    }

}

module.exports = new UserController()