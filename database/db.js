const knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
      // host: 'localhost',
      // user: 'postgres',
      // password: 'maxkok97',
      // database: 'db'
      host: 'ec2-54-90-211-192.compute-1.amazonaws.com',
      user: 'qkyyfwjwpncacq',
      password: '0e555a8c3a16fd501419527ec03cb68614eb6fb7182fa9b945be97d4e14a06c7',
      database: 'd9g5g1n9l35ea9',
      ssl: true
    },
  },
);
// try {
//   await knex.schema
//   .createTable('users', table => {
//     table.increments('id');
//     table.string('name');
//     table.string('email');
//     table.string('password');
//   })
//   .createTable('post', table => {
//     table.increments('id');
//     table.string('title');
//     table.string('content');
//     table.string('create_date');
//     table.string('update_date');
//     table.string('img');
//     table
//       .integer('userid')
//       .unsigned()
//       .references('users.id');
//   })
//   .createTable('comments', table => {
//     table.increments('id');
//     table.string('content');
//     table.string('create_date');
//     table
//       .integer('userid')
//       .unsigned()
//       .references('users.id');
//     table
//       .integer('postid')
//       .unsigned()
//       .references('postid.id');
//   })
//   .createTable('likes', table => {
//     table.increments('id');
//     table
//       .integer('userid')
//       .unsigned()
//       .references('users.id');
//     table
//       .integer('postid')
//       .unsigned()
//       .references('postid.id');
//   })
//   .createTable('answer', table => {
//     table.increments('id');
//     table.string('content');
//     table.string('create_date');
//     table
//       .integer('userid')
//       .unsigned()
//       .references('users.id');
//     table
//       .integer('commentid')
//       .unsigned()
//       .references('postid.id');
//   })
//   .createTable('comments_likes', table => {
//     table.increments('id');
//     table
//       .integer('userid')
//       .unsigned()
//       .references('users.id');
//     table
//       .integer('commentsID')
//       .unsigned()
//       .references('comments.id');
//   })
// } catch(e){
//   console.log(e);
// }


module.exports = knex

