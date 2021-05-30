const moment = require('moment')
const db = require('../database/db')


class post {
    async postCreate(req, res) {
        try {
            let title = req.body.title, content = req.body.content;
            const dates = moment().format('YYYY-MM-DD HH:mm:ss')
            let img = req.file.path ? req.file.path : null
            if (!title || !content) return res.status(400).json({success: false, errorMesage: 'Поля не должны буть пустыми'}) 
            await db.query('INSERT INTO post(userID, title, content, create_date, img) values($1, $2, $3, $4, $5) RETURNING *', [req.user.id, title, content, dates, img])
            return res.status(200).json({success: true})
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async postUpdate(req, res) {
        try {
            const opts = {};
            if (req.body.title) opts.title = req.body.title;
            if (req.body.content) opts.content = req.body.content;
            if (req.body.file) opts.image = req.body.file;
            const id = req.body.id
            let sql = 'UPDATE post SET ';
            const data = [id]
            opts.update_date = moment().format('YYYY-MM-DD HH:mm:ss');
            for (let set in opts) {
                data.push(opts[set]);
                sql += `${set} = $${data.length}, `;
            }
            sql = sql.substr(0, sql.length - 2) + ' ';
            sql += 'where id = $1';
            const result = await db.query(sql, data);
            if (result) return res.status(200).json({success: true})
            else return res.status(400).json({success: false})
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async postInfo(req, res) {
        try {
            const id = req.params.id
            const post = await db.query('select title, content, create_date, update_date, img from post where id = $1', [id])
            const likes = await db.query('SELECT COUNT(*) FROM likes WHERE postID = $1', [id])
            if (post || likes) {
            let create_date = moment(post.rows[0].create_date).format('YYYY-MM-DD HH:mm:ss')
            let update_date = moment(post.rows[0].update_date).format('YYYY-MM-DD HH:mm:ss')
            res.status(200).json({success: true, info: {title: post.rows[0].title, content: post.rows[0].content, create_date: create_date,
            update_date: update_date,likes: likes.rows[0].count ,image: post.rows[0].img }})
            } else {
                res.status(400).json({success: false})  
            }
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async postLike(req, res) {
        try {
            const postID = req.params.id
            let query = await db.query('select * from likes where postID = $1 and userID = $2', [postID, req.user.id])
            if (query.rows.length == 0) {
                //add like
                await db.query('INSERT INTO likes(postID, userID) values($1, $2)', [postID, req.user.id])
                return res.status(200).json({success: true, like: true})
            } else {
                //remove like
                await db.query('DELETE FROM likes WHERE postID = $1 and userID = $2', [postID, req.user.id])
                return res.status(200).json({success: true, like: false})
            }
        } catch(e) {
            console.log(e)
        }
    }
}

module.exports = new post()