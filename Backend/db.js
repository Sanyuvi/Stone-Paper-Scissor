const { Pool } = require("pg");

// PostgreSQL connection setup
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "StonePaperScissors",
  password: "test",
  port: 5432,
});

module.exports = pool;
