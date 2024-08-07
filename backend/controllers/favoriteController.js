const MoviesModel = require("../models/moviesModel");
const statusCodes = require("../utils/statusCodes");
const messages = require("../utils/messages");
const UserModel = require("../models/userModel");
const favoriteMoviesModel = require("../models/favMoviesModel");

const addFavoriteController = async (req, res) => {
  try {
    const { imdbID } = req.body;
    const userId = req.user.id;

    const movie = await MoviesModel.getMovieByImdbID( imdbID );

    if (!movie) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: "false",
        message: messages.MOVIE_NOT_EXISTS,
      });
    }

    const user = await UserModel.getUserById(userId);
    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: "false",
        message: messages.USER_NOT_FOUND,
      });
    }

    const existingFavorite =
      await favoriteMoviesModel.getFavoriteMoviesByUserId(userId);

      console.log("xcghjkl", existingFavorite);
    if (existingFavorite) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: "false",
        message: messages.MOVIE_EXISTS,
      });
    }

    await favoriteMoviesModel.addFavoriteMovie(userId, movie.imdbID);

    res.status(statusCodes.OK).json({
      success: "true",
      message: messages.ADD_FAVORITE_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: "false",
      error: error.message,
    });
  }
};

const removeFavoriteController = async (req, res) => {
  try {
    const { imdbID } = req.body;
    const userId = req.user.id;

    const user = await UserModel.getUserById(userId);
    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: "false",
        message: messages.USER_NOT_FOUND,
      });
    }

    const movie = await MoviesModel.getMovieByImdbID(imdbID );

    if (!movie) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: "false",
        message: messages.MOVIE_NOT_EXISTS,
      });
    }

    await favoriteMoviesModel.removeFavoriteMovie(userId, imdbID);

    res.status(statusCodes.OK).json({
      success: "true",
      message: messages.REMOVE_FAVORITE_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: "false",
      error: error.message,
    });
  }
};

const getFavoritesController = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        success: false,
        message: messages.MISSING_AUTH_HEADER,
      });
    }

    const userId = req.user.id;
    const user = await UserModel.getUserById(userId);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: "false",
        message: messages.USER_NOT_FOUND,
      });
    }

    const favoriteMovies = await favoriteMoviesModel.getFavoriteMoviesByUserId(userId);

    res.status(statusCodes.OK).json({
      success: true,
      message: messages.FAVORITES_FETCHED_SUCCESSFULLY,
      favorites: favoriteMovies,
    });
  } catch (error) {
    console.error(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: messages.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};



module.exports = {
  addFavoriteController,
  removeFavoriteController,
  getFavoritesController,
};