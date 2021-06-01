const moment = require('moment')
const db = require('../database/db')


class post {
    async postCreate(req, res) {
        try {
            let title = req.body.title, content = req.body.content;
            const dates = moment().format('YYYY-MM-DD HH:mm:ss')
            let img = req.file.path ? req.file.path : null
            if (!title || !content) return res.status(400).json({success: false, errorMessage: 'Поля не должны буть пустыми'}) 
            const result = await db.query('INSERT INTO post(userID, title, content, create_date, img) values($1, $2, $3, $4, $5) RETURNING *', [req.user.id, title, content, dates, img])
            if (result) return res.status(200).json({success: true})
            else return res.status(400).json({success: false})
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async postUpdate(req, res) {
        try {
            const id = req.body.id
            const author = await db.query('select * from post where id = $1 and userID = $2', [id, req.user.id])
            if (author.rows == 0) return res.status(400).json({success: false, errorMessage: 'Вы не автор поста'})
            const opts = {}
            if (req.body.title) opts.title = req.body.title
            if (req.body.content) opts.content = req.body.content
            if (req.body.file) opts.image = req.body.file
            let sql = 'UPDATE post SET '
            const data = [id]
            opts.update_date = moment().format('YYYY-MM-DD HH:mm:ss')
            for (let set in opts) {
                data.push(opts[set])
                sql += `${set} = $${data.length}, `
            }
            sql = sql.substr(0, sql.length - 2) + ' '
            sql += 'where id = $1'
            const result = await db.query(sql, data)
            if (result) return res.status(200).json({success: true})
            else return res.status(400).json({success: false})
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async postInfo(req, res) {
        try {
            const id = req.params.id
            const post = await db.query('select title,userID, content, create_date, update_date, img from post where id = $1', [id])
            const likes = await db.query('SELECT COUNT(*) FROM likes WHERE postID = $1', [id])
            const author = await db.query('select name from users where id = $1', [post.rows[0].userid])
            if (post || likes) {
            let create_date = moment(post.rows[0].create_date).format('YYYY-MM-DD HH:mm:ss')
            let update_date = moment(post.rows[0].update_date).format('YYYY-MM-DD HH:mm:ss')
            res.status(200).json({success: true, info: {author: author.rows[0].name,title: post.rows[0].title, content: post.rows[0].content, create_date: create_date,
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
            res.status(500).json(e)
        }
    }

    async info(req, res) {
        try {
            const post = await db.query(`
            SELECT post.title, post.content, post.create_date, users.name, users.email, COUNT(likes.postID) AS likes
            FROM post,users,likes
            where post.userID = users.id AND likes.postID = post.id 
            GROUP BY post.title, post.content, post.create_date, users.name, users.email
            ORDER BY create_date DESC limit 15`)
            let create_date = moment(post.rows[0].create_date).format('YYYY-MM-DD HH:mm:ss')
            for(let i=0; i < post.rowCount; i++) {
                let content = post.rows[i].content.substr(0,69)+'...';
                res.status(200).json({author: post.rows[i].name,title: post.rows[i].title, content: content, create_date: create_date,
                likes: post.rows[i].likes})
            }
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async newComments(req, res){
        try {
            const {postID, content} = req.body
            if (!postID || !content) return res.status(400).json({success: false, errorMessage: 'Поля не должны буть пустыми'})
            if (content.length > 255) return res.status(400).json({success: false, errorMessage: 'Текст должен быть не больше 255 символов'})
            const result = await db.query('INSERT INTO comments(userID, postID, content) values($1, $2, $3)', [req.user.id, postID, content])
            if (result) return res.status(200).json({success: true})
            else return res.status(400).json({success: false})
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async answerComment(req, res) {
        try {
            const {commentID, content} = req.body
            if (!postID || !content) return res.status(400).json({success: false, errorMessage: 'Поля не должны буть пустыми'})
            if (content.length > 255) return res.status(400).json({success: false, errorMessage: 'Текст должен быть не больше 255 символов'})
            const result = await db.query('INSERT INTO answer(userID, commnetID, content) values($1, $2, $3)', [req.user.id, commentID, content])
            if (result) return res.status(200).json({success: true})
            else return res.status(400).json({success: false})
        } catch(e) {
            res.status(500).json(e)
        }
    }
}

module.exports = new post()