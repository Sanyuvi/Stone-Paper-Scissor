const { Pool } = require("pg");

// PostgreSQL connection setup
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "stonepaperscissors",
//   password: "test",
//   port: 5432,
// });

// module.exports = pool;

require('dotenv').config();
// const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

// Example of a query to test the connection
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to the database!");
        const res = await client.query('SELECT NOW()');
        console.log('Current time:', res.rows[0]);
        client.release();
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

testConnection();

module.exports = pool

