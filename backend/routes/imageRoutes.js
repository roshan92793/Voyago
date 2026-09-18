const express = require("express");

const {
    fetchAndSaveDestinationImages
} = require("../controllers/imageController");

const router = express.Router();

router.get(
    "/:destinationId/images",
    fetchAndSaveDestinationImages
);

module.exports = router;