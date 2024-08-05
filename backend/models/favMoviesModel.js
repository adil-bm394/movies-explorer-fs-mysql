const pool = require("../config/database");

const createUserFavoritesTable = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        imdbID VARCHAR(20) NOT NULL,
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

const addFavoriteMovie = async (userId, imdbID) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      "INSERT INTO user_favorites (user_id, imdbID) VALUES (?, ?)",
      [userId, imdbID]
    );
  } finally {
    connection.release();
  }
};

const removeFavoriteMovie = async (userId, imdbID) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      "DELETE FROM user_favorites WHERE user_id = ? AND imdbID = ?",
      [userId, imdbID]
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
      SELECT m.* FROM user_favorites uf
      JOIN movies m ON uf.imdbID = m.imdbID
      WHERE uf.user_id = ?
    `,
      [userId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

const initFavorites = async () => {
  await createUserFavoritesTable();
};

module.exports = {
  addFavoriteMovie,
  removeFavoriteMovie,
  getFavoriteMoviesByUserId,
  initFavorites,
};
