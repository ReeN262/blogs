
const moment = require('moment');

const knex = require('../database/db');

class post {
  async Create(req) { 
    let title = req.body.title, content = req.body.content, img = req.file ? req.file.path : null;

    const dates = moment().format('YYYY-MM-DD HH:mm:ss');
    await knex('post').insert({userid: req.user.id, title: title, content: content, create_date: dates, img: img});
    return {success: true};
  }
  async Update(req, res) {
    const id = req.body.id, title = req.body.title, content = req.body.content, img = req.file ? req.file.path : null;
    const author = await knex('post').select('*').where({id: id, userid: req.user.id})
    const time = moment().format('YYYY-MM-DD HH:mm:ss')

    if (author.length === 0) return res.status(400).json({errorMessage: 'You are not the author'})
    
    if (title) {
      await knex('post').update({title: title, update_date: time})
    }
    if (content) {
      await knex('post').update({content: content, update_date: time})
    }
    if (img) {
      await knex('post').update({img: img, update_date: time})
    }
    return {success: true};
  }
  async Info(req) {
    const id = req.params.id
    let info;
    await knex.select(['post.*', 'users.name'])
    .count('likes.userid')
    .from('post', 'users', 'likes')
    .innerJoin('users', 'post.userid', 'users.id')
    .leftJoin('likes','post.id','likes.postid')
    .where('post.id', id)
    .groupBy('post.id', 'users.name')
    .then(function(post){
      let create_date = moment(post[0].create_date).format('YYYY-MM-DD HH:mm:ss')
      let update_date = moment(post[0].update_date).format('YYYY-MM-DD HH:mm:ss')

      info = {author: post[0].name, title: post[0].title, content: post[0].content, create_date: create_date,
      update_date: update_date,likes: post[0].count ,image: post[0].img };
    }); 
    return info;
  }
  async infoList(req) {
    let limit = req.query.limit ? req.query.limit : 15;
    let blogs = [];

    await knex.select(['post.*', 'users.name'])
    .count('likes.userid')
    .from('post', 'users', 'likes')
    .innerJoin('users', 'post.userid', 'users.id')
    .leftJoin('likes','post.id','likes.postid')
    .groupBy('post.id', 'users.name')
    .orderBy('create_date', 'desc')
    .limit(limit)
    .then(function(post){
      for(let i=0; i < post.length; i++) {
        let create_date = moment(post[i].create_date).format('YYYY-MM-DD HH:mm:ss')
        let content = post[i].content.substr(0,69)+'...';

        blogs[i] = {
          author: post[i].name,title: post[i].title, content: content, create_date: create_date, img: post[i].img, likes: post[i].count
        } 
      }
    }); 
    return blogs;
  }
  async postLike(req) {
    const postID = req.params.id;
    const query = await knex('likes').where({postid: postID, userid: req.user.id});

        if (query.length === 0) {
        //add like
        await knex('likes').insert({postid: postID, userid: req.user.id});
        return {like: true};
    } else {
        //remove like
        await knex('likes').delete().where({postid: postID, userid: req.user.id});
        return {like: false};
    }
  }
}

module.exports = new post()