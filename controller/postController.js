const moment = require('moment')
const db = require('../database/db')


class post {
    async postCreate(req, res) {
        try {
            let title = req.body.title, content = req.body.content;
            const dates = moment().format('YYYY-MM-DD HH:mm:ss')
            let img = req.file.path ? req.file.path : null
            if (!title || !content) return res.status(400).json({success: false, errorMessage: 'Fields are empty'}) 
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
            if (author.rows == 0) return res.status(400).json({success: false, errorMessage: 'You are not the author'})
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
            const post = await db.query(`SELECT post.*, users.name, COUNT(likes.userID) AS likes 
            FROM ((post INNER JOIN users ON post.userID = users.id) 
            LEFT JOIN likes ON post.id = likes.postID)
            where post.id = $1 
            GROUP BY post.id, users.name`, [id])
            if (post) {
            let create_date = moment(post.rows[0].create_date).format('YYYY-MM-DD HH:mm:ss')
            let update_date = moment(post.rows[0].update_date).format('YYYY-MM-DD HH:mm:ss')
            res.status(200).json({success: true, info: {author: post.rows[0].name,title: post.rows[0].title, content: post.rows[0].content, create_date: create_date,
            update_date: update_date,likes: post.rows[0].count ,image: post.rows[0].img }})
            } else {
                res.status(400).json({success: false})  
            }
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async info(req, res) {
        try {
            let limit = req.query.limit ? req.query.limit : 15;
            const post = await db.query(`SELECT post.*, users.name , COUNT(likes.userID) AS likes
            FROM (((post INNER JOIN users ON post.userID = users.id) 
            LEFT JOIN likes ON post.id = likes.postID)
            GROUP BY post.id, users.name
            ORDER BY create_date DESC limit $1`, [limit])
            let blogs = [];
            for(let i=0; i < post.rowCount; i++) {
                let create_date = moment(post.rows[i].create_date).format('YYYY-MM-DD HH:mm:ss')
                let content = post.rows[i].content.substr(0,69)+'...';
                blogs[i] = {
                    author: post.rows[i].name,title: post.rows[i].title, content: content, create_date: create_date, img: post.rows[i].img, likes: post.rows[i].likes
                } 
            }
            return res.status(200).json(blogs)
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

    async newComments(req, res){
        try {
            const {postID, content} = req.body
            if (!postID || !content) return res.status(400).json({success: false, errorMessage: 'Fields are empty'})
            if (content.length > 255) return res.status(400).json({success: false, errorMessage: 'Comment must not exceed 255 characters'})
            const dates = moment().format('YYYY-MM-DD HH:mm:ss')
            const result = await db.query('INSERT INTO comments(userID, postID, content, create_date) values($1, $2, $3, $4)', [req.user.id, postID, content, dates])
            if (result) return res.status(200).json({success: true})
            else return res.status(400).json({success: false})
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async answerComment(req, res) {
        try {
            const {commentID, content} = req.body
            if (!commentID || !content) return res.status(400).json({success: false, errorMessage: 'Fields are empty'})
            if (content.length > 255) return res.status(400).json({success: false, errorMessage: 'Answer must not exceed 255 characters'})
            const dates = moment().format('YYYY-MM-DD HH:mm:ss')
            const result = await db.query('INSERT INTO answer(userID, commentID, content, create_date) values($1, $2, $3, $4)', [req.user.id, commentID, content, dates])
            if (result) return res.status(200).json({success: true})
            else return res.status(400).json({success: false})
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async commentLike(req, res) {
        try {
            const commentID = req.params.id
            let query = await db.query('select * from comments_likes where postID = $1 and userID = $2', [commentID, req.user.id])
            if (query.rows.length == 0) {
                //add like
                await db.query('INSERT INTO from comments_likes(commentsID, userID) values($1, $2)', [commentID, req.user.id])
                return res.status(200).json({success: true, like: true})
            } else {
                //remove like
                await db.query('DELETE FROM from comments_likes WHERE commentsID = $1 and userID = $2', [commentID, req.user.id])
                return res.status(200).json({success: true, like: false})
            }
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async getComments(req, res) {
        try {
            const postID = req.params.postID
            let comments = []
            if (!postID) return res.status(400).json({success: false, errorMessage: 'invalid post ID'})
            const post = await db.query(`SELECT comments.*,users.name , COUNT(comments_likes.userID) AS likes
            FROM (((comments INNER JOIN users ON comments.userID = users.id) 
            LEFT JOIN comments_likes ON comments.id = comments_likes.commentsID)
            LEFT JOIN post ON comments.postID = post.id)
            where post.id = $1
            GROUP BY comments.id, users.name
            ORDER BY comments.id ASC`, [postID])
            if (post) {
                for(let i=0; i < post.rowCount; i++) {
                    let create_date = moment(post.rows[i].create_date).format('YYYY-MM-DD HH:mm:ss')
                    comments[i] = {
                        author: post.rows[i].name, content: post.rows[i].content,date: create_date, likes: post.rows[i].likes
                    } 
                }
                res.status(200).json(comments)
            }
        } catch(e) {
            res.status(500).json(e)
        }
    }
    async getAnswers(req, res) {
        try {
            const commentID = req.params.commentID
            let answers = []
            if (!commentID) return res.status(400).json({success: false, errorMessage: 'invalid comment ID'})
            const answer = await db.query(`SELECT answer.*, users.name
            from answer, users, comments
            where answer.userID = users.id and answer.commentID = comments.id and comments.id = $1
            ORDER BY create_date ASC`, [commentID])
            if (answer) {
                for(let i=0; i < answer.rowCount; i++) {
                    let create_date = moment(answer.rows[i].create_date).format('YYYY-MM-DD HH:mm:ss')
                    answers[i] = {
                        author: answer.rows[i].name, content: answer.rows[i].content,date: create_date
                    } 
                }
                res.status(200).json(answers)
            }
        } catch(e) {
            res.status(500).json(e)
        }
    }
}

module.exports = new post()