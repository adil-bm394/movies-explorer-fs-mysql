const pool = require("../config/database");

const createRatingsTable = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        imdbID VARCHAR(20) NOT NULL,
        user_id INT NOT NULL,
        rating INT DEFAULT 0,
        userName VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (imdbID) REFERENCES movies(imdbID),
         INDEX idx_user_id (user_id),
        INDEX idx_imdbID (imdbID)
      )
    `);
  } finally {
    connection.release();
  }
};

const addRating = async (movieId, userId, rating, userName) => {

  const connection = await pool.getConnection();
  try {
    await connection.query(
      "INSERT INTO ratings (imdbID, user_id, rating, userName) VALUES (?, ?, ?, ?)",
      [movieId, userId, rating, userName]
    );
  } finally {
    connection.release();
  }
};

const updateRating = async (userId, movieId, rating, userName) => {

  const connection = await pool.getConnection();
  try {
    await connection.query(
      "UPDATE ratings SET rating = ?, userName = ? WHERE user_id = ? AND imdbID = ?",
      [rating, userName, userId, movieId]
    );
  } finally {
    connection.release();
  }
};

const findRatingByUserAndMovie = async (userId, movieId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM ratings WHERE user_id = ? AND imdbID = ?",
      [userId, movieId]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

const getRatingsByMovieId = async (movieId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT r.id, r.imdbID, r.user_id, r.rating, r.userName, u.name AS user_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.imdbID = ?
    `,
      [movieId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

const initRatings = async () => {
  await createRatingsTable();
};

module.exports = {
  addRating,
  updateRating,
  findRatingByUserAndMovie,
  getRatingsByMovieId,
  initRatings,
};
