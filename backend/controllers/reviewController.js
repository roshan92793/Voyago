const Review = require("../models/review");
const Destination = require("../models/destination");

// ==========================================
// CREATE REVIEW
// POST /api/reviews
// ==========================================
const createReview = async (req, res) => {
  try {
    const { destination, rating, comment } = req.body;

    // Check required fields
    if (!destination || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Destination, rating and comment are required",
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check destination exists
    const destinationExists = await Destination.findById(destination);

    if (!destinationExists) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    // Check if user already reviewed this destination
    const existingReview = await Review.findOne({
      user: req.user.userId,
      destination,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this destination",
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.userId,
      destination,
      rating,
      comment,
    });

    // Return populated review
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("destination", "name");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// GET REVIEWS FOR DESTINATION
// GET /api/reviews/destination/:destinationId
// ==========================================
const getDestinationReviews = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const reviews = await Review.find({
      destination: destinationId,
    })
      .populate("user", "name")
      .populate("destination", "name")
      .sort({ createdAt: -1 });

    // Calculate average rating
    let averageRating = 0;

    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );

      averageRating = totalRating / reviews.length;
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: Number(averageRating.toFixed(1)),
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE REVIEW
// PUT /api/reviews/:id
// ==========================================
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Ownership check
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own review",
      });
    }

    // Validate rating
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (rating !== undefined) {
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .populate("destination", "name");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE REVIEW
// DELETE /api/reviews/:id
// ==========================================
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Ownership check
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review",
      });
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  createReview,
  getDestinationReviews,
  updateReview,
  deleteReview,
};