const { Client,Pool } = require('pg');
client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
	database: 'second',
	port:5432
});
client.connect();

const pool = new Pool()
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
  }