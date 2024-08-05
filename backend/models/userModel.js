const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const serverConfig = require("../config/serverConfig");

const createUsersTable = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(255) NOT NULL
            )
        `);
  } finally {
    connection.release();
  }
};

const createUser = async (name, email, password, phone) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const connection = await pool.getConnection();
  try {
    await connection.query(
      "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, phone]
    );
  } finally {
    connection.release();
  }
};

const getUserByEmail = async (email) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

const getUserById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};


const init = async () => {
  await createUsersTable();
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  comparePassword,
  init,
};
