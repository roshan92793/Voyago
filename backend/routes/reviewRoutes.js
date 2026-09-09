const express = require("express");

const router = express.Router();

const {
  createReview,
  getDestinationReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");


// Create review
router.post("/", authMiddleware, createReview);

// Get all reviews for a destination
router.get("/destination/:destinationId", getDestinationReviews);

// Update own review
router.put("/:id", authMiddleware, updateReview);

// Delete own review
router.delete("/:id", authMiddleware, deleteReview);


module.exports = router;