const express = require("express");

const {
    createDestination,
    getDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination
} = require("../controllers/destinationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getDestinations);

router.get("/:id", getDestinationById);

router.post("/", authMiddleware, createDestination);

router.put("/:id", authMiddleware, updateDestination);

router.delete("/:id", authMiddleware, deleteDestination);

module.exports = router;