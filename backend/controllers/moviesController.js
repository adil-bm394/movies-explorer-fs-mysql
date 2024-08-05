const MoviesModel = require("../models/moviesModel");
const statusCodes = require("../utils/statusCodes");
const messages = require("../utils/messages");

const moviesController = async (req, res) => {
  try {
    const movies = await MoviesModel.getAllMovies();
    res.status(statusCodes.OK).json({
      success: "true",
      movies: movies,
    });
  } catch (error) {
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  moviesController,
};
