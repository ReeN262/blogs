const bd = require('../db')

class UserController {
    async createUser(req, res){
    const {name, password, email} = req.body
    const newUsr= await bd.query('INSERT INTO person(name, password, email) values($1, $2, $3) RETURNING *', [name, password, email])
    res.json(newUsr.rows)
    }
    async getUser(req, res){
    const id = req.params.id
    const user = await bd.query('SELECT * FROM person where id_user = $1', [id])
    res.json(user.rows[0])    
    }
    async updateUserPassword(req, res){
    const {id, password} = req.body
    const upUsr = await bd.query('UPDATE person SET password = $1 where id_user = $2 RETURNING *', [password, id])
    res.json(upUsr.rows[0])   
    }
    async deleteUser(req, res){
    const id = req.params.id
    const delUsr = bd.query('DELETE FROM person where id_user = $1', [id])
    res.json('Пользователь удален')      
    }

}

module.exports = new UserController()