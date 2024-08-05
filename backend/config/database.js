const mysql = require("mysql2/promise");
const serverConfig = require("../config/serverConfig");

const pool = mysql.createPool({
  host: serverConfig.DB_HOST,
  user: serverConfig.DB_USER,
  password: serverConfig.DB_PASSWORD,
  database: serverConfig.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;