const RatingModel = require("../models/ratingModel");
const statusCodes = require("../utils/statusCodes");
const messages = require("../utils/messages");

const addRatingController = async (req, res) => {
  try {
    const { movieId, rating, userName } = req.body;
    const userId = req.user.id;

    const existingRating = await RatingModel.findRatingByUserAndMovie(
      userId,
      movieId
    );

    if (existingRating) {
      await RatingModel.updateRating(userId, movieId, rating, userName);
      return res.status(statusCodes.OK).json({
        success: true,
        message: messages.UPDATE_SUCCESS,
      });

    } else {
      await RatingModel.addRating(movieId, userId, rating, userName);
      return res.status(statusCodes.CREATED).json({
        success: true,
        message: messages.RATING_SAVED_SUCCESSFULLY,
      });
    }

  } catch (error) {
    console.log("Error adding rating:", error.message);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: messages.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const fetchRatingsController = async (req, res) => {
  try {
    const { movieId } = req.params;

    const ratings = await RatingModel.getRatingsByMovieId(movieId);

    res.status(statusCodes.OK).json({
      success: true,
      message: messages.RATINGS_FETCHED_SUCCESSFULLY,
      ratings,
    });
  } catch (error) {
    console.log("Error fetching ratings:", error.message);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: messages.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

module.exports = { addRatingController, fetchRatingsController };
