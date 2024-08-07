const MoviesModel = require("../models/moviesModel");
const statusCodes = require("../utils/statusCodes");
const messages = require("../utils/messages");
const UserModel = require("../models/userModel");
const CommentModel = require("../models/commentModel");

const addCommentController = async (req, res) => {
  try {
    const { imdbID } = req.params;
    const { commentText, rating } = req.body;
    const userId = req.user.id;

    const movie = await MoviesModel.getMovieByImdbID(imdbID);

    if (!movie) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Movie Not Found",
      });
    }

    const user = await UserModel.getUserById(userId);
    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "User Not Found",
      });
    }
    await CommentModel.addComment(imdbID, userId, commentText, rating);

    res.status(statusCodes.OK).json({
      success: true,
      message: "Comment added successfully",
      comment: {
        movieId: imdbID,
        userId: userId,
        userName: user.name,
        comment: commentText,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchCommentsController = async (req, res) => {
  try {
    const { imdbID } = req.params;

    const movie = await MoviesModel.getMovieByImdbID(imdbID);

    if (!movie) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Movie Not Found",
      });
    }

    const comments = await CommentModel.getCommentsByMovieId(imdbID);

    res.status(statusCodes.OK).json({
      success: true,
      message: "Comments fetched successfully",
      comments: comments.map((comment) => ({
        userId: comment.user_id,
        userName: comment.user_name,
        comment: comment.comment,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { addCommentController, fetchCommentsController };
