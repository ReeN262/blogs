const moment = require('moment')
const db = require('../database/db')


class post {
    async postCreate(req, res) {
        try {
            const {title, content} = req.body
            console.log(title, content)
            const dates = moment().format('DD-MM-YYYY')
            const posts = await db.query('INSERT INTO post(title, content, create_date, img) values($1, $2, $3, $4) RETURNING *', [title, content, dates, req.file.path])
            if (posts) res.status(200).json({success: true, message: "Пост создан"})
            else res.status(400).json({success: false, errorMessage: 'еще не придумал'})
        } catch(e) {
            console.log(e)
        }
    }
    async postUpdate(req, res) {
        try {

        } catch(e) {
            console.log(e)
        }
    }
}

module.exports = new post()