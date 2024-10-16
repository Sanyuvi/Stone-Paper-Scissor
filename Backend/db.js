const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
  user: "ubuntu",
  host: "localhost",
  database: "stonepaperscissors",
  password: "test",
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Connected to PostgreSQL database");
  }
});

module.exports = pool;
