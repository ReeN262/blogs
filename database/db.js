const knex = require('knex')({
    client: 'postgres',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'maxkok97',
      database: 'db'
      // host: 'ec2-54-90-211-192.compute-1.amazonaws.com',
      // user: 'qkyyfwjwpncacq',
      // password: '0e555a8c3a16fd501419527ec03cb68614eb6fb7182fa9b945be97d4e14a06c7',
      // database: 'd9g5g1n9l35ea9'
    },
  },
);
module.exports = knex

