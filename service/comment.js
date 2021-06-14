const moment = require('moment');

const knex = require('../database/db');

class comment {
  async newComments(req){
    const {post_id, content} = req.body;
    const dates = moment().format('YYYY-MM-DD HH:mm:ss');

    await knex('comments').insert({userid: req.user.id, postid: post_id, content: content, create_date: dates});

    return {success: true};
  }
  async answerComment(req) {
    const {comment_id, content} = req.body
    const dates = moment().format('YYYY-MM-DD HH:mm:ss');
    await knex('answer').insert({userid: req.user.id, commentid: comment_id, content: content, create_date: dates});
    return {success: true};
  }
  async commentLike(req) {
    const comment_id = req.params.comment_id;
    const query = await knex('comments_likes').where({commentsid: comment_id, userid: req.user.id});

    if (query.length === 0) {
        //add like
        await knex('comments_likes').insert({commentsid: comment_id, userid: req.user.id});
        return {like: true};
    } else {
        //remove like
        await knex('comments_likes').delete().where({commentsid: comment_id, userid: req.user.id});
        return {like: false};
    }
  }
  async getComments(req) {
    const postID = req.params.postID;
    let comments = [];
    await knex.select(['comments.*', 'users.name'])
    .count('comments_likes.userid')
    .from('comments')
    .innerJoin('users', 'comments.userid', 'users.id')
    .leftJoin('comments_likes','comments.id','comments_likes.id')
    .leftJoin('post','comments.postid','post.id')
    .where('post.id', postID)
    .groupBy('comments.id', 'users.name')
    .orderBy('comments.id', 'ASC')
    .then(function(comm){
      for(let i=0; i < comm.length; i++) {
        let create_date = moment(comm[i].create_date).format('YYYY-MM-DD HH:mm:ss');
        comments[i] = {
            author: comm[i].name, content: comm[i].content,date: create_date, likes: comm[i].likes
        };  
      }
    })
    return comments;
  }
  async getAnswers(req) {
    const commentID = req.params.comment_id
    let answers = []
    await knex.select(['answer.*', 'users.name'])
    .from('answer')
    .innerJoin('users','answer.userid','users.id')
    .innerJoin('comments', 'answer.commentid', 'comments.id')
    .where('comments.id', commentID)
    .orderBy('comments.id', 'ASC')
    .then(function(ans){
      for(let i=0; i < ans.length; i++) {
        let create_date = moment(ans[i].create_date).format('YYYY-MM-DD HH:mm:ss');
        answers[i] = {
            author: ans[i].name, content: ans[i].content,date: create_date
        };
      }
    });
    return answers;
  }
}

module.exports = new comment();