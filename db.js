const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'maxkok97', 
    port: 5432,
  })
//psql -Upostgres template1

module.exports = pool