const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const morgan= require('morgan');
const pool = require("./config/database");
//const { initMovies } = require("./models/moviesModel");
const { initFavorites } = require("./models/favMoviesModel");
const { initComments } = require("./models/commentModel");
const { initRatings } = require("./models/ratingModel");
const { initUsers } = require("./models/userModel");
const serverConfig = require("./config/serverConfig");



dotenv.config();

pool.getConnection();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());


// Initialize tables
const initializeTables = async () => {
  //await initMovies();
  await initFavorites();
  await initComments();
  await initRatings();
  await initUsers();
};

initializeTables().then(() => {
  console.log(`Database tables initialized`.bgGreen.bgWhite);
}).catch((error) => {
  console.error(`Error initializing database tables:, ${error}`.bgRed.bgWhite);
});




//Routes
app.use("/api/v1", require("./routes/authRoutes"));
app.use("/api/v1", require("./routes/moviesRoute"));


const PORT = serverConfig.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`.bgGreen.white);
});
