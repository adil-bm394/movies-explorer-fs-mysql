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
        user_name VARCHAR(255) NOT NULL,
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
      "INSERT INTO ratings (movie_id, user_id, rating, user_name) VALUES (?, ?, ?, ?)",
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
      "UPDATE ratings SET rating = ?, user_name = ? WHERE user_id = ? AND movie_id = ?",
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
      "SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?",
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
      SELECT r.id, r.movie_id, r.user_id, r.rating, r.user_name, u.name AS user_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.movie_id = ?
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
