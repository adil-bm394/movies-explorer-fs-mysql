const pool = require("../config/database");

const createCommentsTable = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                movie_id VARCHAR(20) NOT NULL,
                user_id INT NOT NULL,
                comment TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (movie_id) REFERENCES movies(imdbID),
                INDEX idx_user_id (user_id),
                INDEX idx_movie_id (movie_id)
      )
    `);
  } finally {
    connection.release();
  }
};

const addComment = async (movieId, userId, commentText) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      "INSERT INTO comments (movie_id, user_id, comment) VALUES (?, ?, ?)",
      [movieId, userId, commentText]
    );
  } finally {
    connection.release();
  }
};

const getCommentsByMovieId = async (movieId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT c.id, c.movie_id, c.user_id, c.comment, u.name AS user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.movie_id = ?
    `,
      [movieId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

const initComments = async () => {
  await createCommentsTable();
};

module.exports = {
  addComment,
  getCommentsByMovieId,
  initComments,
};
