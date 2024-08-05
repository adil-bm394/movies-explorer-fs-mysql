const pool = require("../config/database");

const createFavoriteMoviesTable = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
            CREATE TABLE IF NOT EXISTS favorite_movies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                movie_id VARCHAR(20) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (movie_id) REFERENCES movies(imdbID),
                UNIQUE KEY unique_favorite (user_id, movie_id)
            )
        `);
  } finally {
    connection.release();
  }
};

const addFavoriteMovie = async (userId, movieId) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      "INSERT INTO favorite_movies (user_id, movie_id) VALUES (?, ?)",
      [userId, movieId]
    );
  } finally {
    connection.release();
  }
};

const removeFavoriteMovie = async (userId, movieId) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      "DELETE FROM favorite_movies WHERE user_id = ? AND movie_id = ?",
      [userId, movieId]
    );
  } finally {
    connection.release();
  }
};

const getFavoriteMoviesByUserId = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `
            SELECT m.* FROM favorite_movies f
            JOIN movies m ON f.movie_id = m.imdbID
            WHERE f.user_id = ?
        `,
      [userId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

const init = async () => {
  await createFavoriteMoviesTable();
};

module.exports = {
  addFavoriteMovie,
  removeFavoriteMovie,
  getFavoriteMoviesByUserId,
  init,
};
