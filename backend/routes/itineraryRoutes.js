const express = require("express");

const {
    createItinerary,
    getTripItinerary,
    updateItinerary,
    deleteItinerary
} = require("../controllers/itineraryController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createItinerary);

router.get(
    "/trip/:tripId",
    authMiddleware,
    getTripItinerary
);

router.put(
    "/:id",
    authMiddleware,
    updateItinerary
);

router.delete(
    "/:id",
    authMiddleware,
    deleteItinerary
);

module.exports = router;