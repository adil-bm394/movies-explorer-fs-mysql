const pool = require("../config/database");

// const createMoviesTable = async () => {
//   const connection = await pool.getConnection();
//   try {
//     await connection.query(`
//             CREATE TABLE IF NOT EXISTS movies (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 Title VARCHAR(255) NOT NULL,
//                 Year VARCHAR(10) NOT NULL,
//                 Rated VARCHAR(10),
//                 Released VARCHAR(50),
//                 Runtime VARCHAR(50),
//                 Genre VARCHAR(255),
//                 Director VARCHAR(255),
//                 Writer VARCHAR(255),
//                 Actors VARCHAR(255),
//                 Plot TEXT,
//                 Language VARCHAR(255),
//                 Country VARCHAR(255),
//                 Awards VARCHAR(255),
//                 Poster TEXT,
//                 Metascore VARCHAR(10),
//                 imdbRating VARCHAR(10),
//                 imdbVotes VARCHAR(50),
//                 imdbID VARCHAR(20) NOT NULL UNIQUE,
//                 Type VARCHAR(50),
//                 DVD VARCHAR(50),
//                 BoxOffice VARCHAR(50),
//                 Production VARCHAR(50),
//                 Website VARCHAR(255),
//                 Response VARCHAR(50)
//             )
//         `);
//   } finally {
//     connection.release();
//   }
// };




const getMovieByImdbID = async (imdbID) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM movies WHERE imdbID = ?",
      [imdbID]
    );
    return rows[0];
  } finally {
    connection.release();
  }
};

const getAllMovies = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query("SELECT * FROM movies");
    return rows;
  } finally {
    connection.release();
  }
};

const init = async () => {
  await createMoviesTable();
};

module.exports = {
  getMovieByImdbID,
  getAllMovies,
  init,
};
