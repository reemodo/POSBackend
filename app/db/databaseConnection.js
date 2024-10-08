require('dotenv').config({ path: '../.env.sample' });

const Pool = require('pg').Pool
console.log(process.env.DB_USER)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})
pool.connect((err) => {
    if (err) {
      console.error('Database connection error', err.stack);
    } else {
      console.log('Database connected');
    }
  });

  module.exports = pool;