const { Pool } = require("pg");
const fs = require("fs");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    console.log("PostgreSQL connected! Current time:", res.rows[0].now);
  }
});

module.exports = pool;
